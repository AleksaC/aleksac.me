---
title: "Disabling CPU Limit Enforcement On EKS Managed Nodes"
date: "2023-02-16T23:00:20+00:00"
---

When it comes to managing resources in kubernetes it's often recommended to disable
CPU limit enforcement. This will allow you to set requests=limits so your pods
have [`Guaranteed`](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#guaranteed)
QoS class without being unnecessarily throttled.

If you're running relatively well-behaved workloads, with some leeway when it comes
to available resources and that can scale out using HPA and cluster autoscaler
if need be, the risk of disabling CPU limit enforcement should be low and should
be outweighed by the benefits of your pods being able to handle short load spikes
without losing performance.

A lot of online resources suggest using `--cpu-cfs-quota` kubelet command line flag
to disable CPU limit enforcement. However this flag has been deprecated along
with most other flags. Even though it doesn't seem like these flags will be
removed soon (especially on EKS since it's usually a couple releases behind) it's
safer to use the [config file](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/).

The config file parameter we're looking to change is `cpuCFSQuota`. Since the managed
node AMIs come with existing kubelet config we need to modify it. To do so we need
to use user data of the launch template used for the node groups. To modify the
the config file we can use `jq`:

```text
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"

#!/bin/bash
echo "$(jq ".cpuCFSQuota=false" /etc/kubernetes/kubelet/kubelet-config.json)" \
    > /etc/kubernetes/kubelet/kubelet-config.json

--==MYBOUNDARY==--
```

[Bottlerocket](https://github.com/bottlerocket-os/bottlerocket) uses toml for user data.
Since I've never used bottlerocket I haven't had a chance to test it but it should
look something like this:

```toml
[settings.kubernetes]
cpuCFSQuota = false
```

Note that depending on what you're using to set the user data you may need to
base64-encode it first (e.g. using `base64encode` function in terraform).

For more info see EKS managed node [user data docs](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-user-data)
as well as [user guide](https://github.com/awslabs/amazon-eks-ami/blob/master/doc/USER_GUIDE.md#customizing-kubelet-config)
for the official managed node AMIs.
