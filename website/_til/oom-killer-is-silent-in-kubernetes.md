---
title: "OOM Killer is Silent in Kubernetes"
date: "2023-02-15T20:21:32+00:00"
---

When it comes to resource management in kubernetes one of the most common pieces
of advice you come across is that memory limit for a container should be equal to
its memory request. If you're like me and like learning things the hard way, you
probably lost a node due to a spike in memory usage by one of the pods.

If you're frugal when it comes to handing out resources to your workloads or your
workloads are poorly coded or handle highly unpredictable loads, you've probably
seen containers being restarted with reason `OOMKilled`. This means that one of
the processes inside the container tried to allocate amount of memory that would
put the total memory usage above the limit specified for the container. In this
case the process that got killed was the main process inside the container which
caused the restart.

However many apps run multiple processes and there is no guarantee that the main
process will get killed. This means that if your app uses multiple processes and
doesn't monitor them properly one of them might get killed without you ever knowing.

Unfortunately there doesn't seem to be a great way for catching these events. If
you're using prometheus, you can use node exporter to collect `node_vmstat_oom_kill`
and set up alerts to let you know when a process gets OOM killed. However this will
only tell you on which nodes it happened and you'd need to figure out in which
container it happened (you can use `container_processes` cAdvisor metric for that).
In addition to that, a naive implementation of the alert could add noise to your
container restart alerts in situations where the process that gets killed is the
main process of the container.
