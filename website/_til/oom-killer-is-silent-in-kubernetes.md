---
title: "OOM Killer is Silent in Kubernetes"
date: "2023-02-15T20:21:32+00:00"
---

When it comes to resource management in kubernetes one of the most common pieces
of advice you come across is that memory limit for a container should be equal to
its memory request. If you're like me and like learning things the hard way, you
probably lost a node due to a spike in memory usage by one of the pods. Setting
requests and limits this way is safer but is a delicate act of balancing resource
utilization and stability of your pods. If you set too high values your actual
resource utilization can be low and if you set them too low your application will
keep getting killed as it tries to consume more memory than you specified.

If you're frugal when it comes to handing out resources to your workloads or your
workloads are poorly coded or handle highly unpredictable loads, you've probably
seen containers being restarted with reason `OOMKilled`. This means that one of
the processes inside the container tried to allocate amount of memory that would
put the total memory usage above the limit specified for the container. In this
case the process that got killed was the main process inside the container, which
caused the restart.

However many apps run multiple processes and there is no guarantee that the main
process will get killed. This means that if your app uses multiple processes and
doesn't monitor them properly one of them might get killed without you ever knowing.

If you're running kubernetes 1.24 or higher and using prometheus you can collect and
create alerts on cAdvisor metric `container_oom_events_total`. If you're on an older
version of kubernetes you can use node exporter to collect `node_vmstat_oom_kill`
and set up alerts to let you know when a process gets OOM killed. However this will
only tell you on which nodes it happened and you'd need to figure out in which
container it happened (you can use `container_processes` cAdvisor metric for that).

In either case, a naive implementation of the alerts could add noise to your
container restart alerts in situations where the process that gets killed is the
main process of the container.
