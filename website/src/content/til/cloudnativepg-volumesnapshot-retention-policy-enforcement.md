---
title: "CloudNativePG VolumeSnapshot Retention Policy Enforcement"
description: ""
date: "2024-09-27T22:14:38+00:00"
---

I've been using CloudNativePG to run Postgres clusters for small and non-production
workloads for some time now. It proved to be cost-effective and easy to set up
and maintain.

One of the great features of CloudNativePG is that it makes it easy to set up proper [backups](https://cloudnative-pg.io/documentation/1.24/backup/).
It supports two methods for creating physical base backups. For me the preferred
method has been [`VolumeSnapshot`](https://cloudnative-pg.io/documentation/1.24/backup_volumesnapshot/),
as I think it should be for deployments using volumes backed by CSI drivers that
support snapshots.

`RetentionPolicy` determines when backups and WALs should be deleted (e.g. `7d`).
However, retention policy [isn't enforced](https://cloudnative-pg.io/documentation/1.24/cloudnative-pg.v1/#postgresql-cnpg-io-v1-BackupConfiguration)
for the snapshots when using `VolumeSnapshot` method:

> It's currently only applicable when using the BarmanObjectStore method.

This means that old snapshots won't be deleted automatically, so we need to do
it ourselves. This can be done in many different ways, but the easiest is to
simply add a `CronJob` that will find and delete the expired backups.

Here are the manifests that can be used to set up a cron job that deletes the backups
that are older than the configured retention:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: snapshot-cleanup
rules:
  - apiGroups: ["snapshot.storage.k8s.io"]
    resources: ["volumesnapshots"]
    verbs: ["list", "get", "delete"]
  - apiGroups: ["postgresql.cnpg.io"]
    resources: ["backups"]
    verbs: ["list", "get", "delete"]

---

kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
 name: snapshot-cleanup
subjects:
  - kind: ServiceAccount
    name: snapshot-cleanup
roleRef:
  kind: Role
  name: snapshot-cleanup
  apiGroup: rbac.authorization.k8s.io

---

apiVersion: v1
kind: ServiceAccount
metadata:
  name: snapshot-cleanup
```

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: snapshot-cleanup-script
data:
  cleanup.sh: |
    #!/usr/bin/env bash

    set -eou pipefail;

    delete_before() {
        local obj_kind=$1
        local cluster=$2
        local interval=$3

        kubectl get $obj_kind --selector=cnpg.io/cluster=$cluster -o go-template --template '{{ range .items }}{{ .metadata.name }} {{ .metadata.creationTimestamp }}{{ "\n" }}{{ end }}' \
            | awk '$2 <= "'$(date --date="now - $interval day" -I'seconds' -u | sed 's/+00:00/Z/')'" { print $1 }' \
            | xargs --no-run-if-empty kubectl delete $obj_kind
    }

    delete_before backup $CNPG_CLUSTER_NAME $RETENTION_IN_DAYS
    delete_before volumesnapshot $CNPG_CLUSTER_NAME $RETENTION_IN_DAYS
```

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: snapshot-cleanup
spec:
  # you can set this to some time after the backup is likely to have been completed
  schedule: "0 5 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: snapshot-cleanup
          containers:
            - name: snapshot-cleanup
              image: "bitnami/kubectl:1.31"
              env:
                CNPG_CLUSTER_NAME: example
                RETENTION_IN_DAYS: "14"
              command:
                - bash
                - /opt/cleanup.sh
              volumeMounts:
                - name: snapshot-cleanup-script
                  mountPath: /opt/cleanup.sh
                  subPath: cleanup.sh
          volumes:
            - name: snapshot-cleanup-script
              configMap:
                name: snapshot-cleanup-script
```

You can create a library helm chart or package the cleanup script as a container
image to make it easier to share code between multiple projects.

Alternatively you can use a controller like [Kubernetes Janitor](https://codeberg.org/hjacobs/kube-janitor)
to delete the objects, or even build a custom controller specifically for this
purpose, but I don't think it's worth the effort since I see this as a temporary
solution and expect CNPG to support retention policy enforcement out of the box
at some point.
