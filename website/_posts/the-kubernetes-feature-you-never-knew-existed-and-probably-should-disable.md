---
title: "The Kubernetes Feature You Never Knew Existed and Probably Should Disable"
date: "2023-01-25T00:55:42+00:00"
---

Recently I was deploying an app that used redis to kubernetes. The app obtained
connection parameters through environment variables. One of those variables was
`REDIS_PORT`. However, it didn't have to be set, and if it wasn't the value would
fall back on standard redis port `6379`. When I deployed the app it couldn't start
because it wasn't able to parse the redis port variable as integer.

When I checked the environment variables used by the pod, `REDIS_PORT` wasn't one
of them. I attached to the pod to see what's going on and found something like
this `REDIS_PORT=tcp://10.0.0.11:6379` among the variables. I found a bunch of
other variables like this one, which immediately made me think that they were
injected by the kubelet during the pod startup. Soon I found out that besides
dns service discovery also supports [environment variable service discovery](https://kubernetes.io/docs/concepts/services-networking/service/#environment-variables).

## Why you shouldn't use it

The problem I faced wasn't a huge issue and only took me a few minutes to debug
and fix. However there are many limitations of this feature that make situations
like this almost inevitable and can lead to more serious issues. While these
limitations should be fairly obvious I'll outline them quickly before telling you
how to disable the feature.

I was lucky that in my case the app tried to convert the value of the variable
and broke on startup. If it wasn't the case, it easily could've been a runtime error
interrupting me in doing better things. This is why I (almost) always require all
env variables that my app uses to be set, allow them to be accessed only from one
place and read and validate them on startup.

The other limitation is that discovery only works within the namespace so if you
wanted to use this you couldn't use it for services in another namespace. The
reason why this feature is limited to a single namespace is that it could case
performance issues and even downright [prevent pods from starting](https://dev.to/matthewdailey/post-mortem-kubernetes-pods-dont-start-because-of-too-many-services-1129).
It goes without saying that jamming things into a single namespace for the sake
of using environment variable service discovery is not a good idea.

The final limitation is that pods only get the env variables once, meaning that
they won't know about services created after they were started. This typically
wouldn't be a problem since you usually don't deploy the pods that depend on a
service before deploying the service itself. However in many cases the code that
uses a certain service is toggled at runtime without recreating the pod (e.g. nginx config,
prometheus config, apps that have features that can be toggled through the
database etc.). Since the pod only receives the env variables when it's started
the process will receive the same environment variables each time it reloads no
matter what.

## How to disable the feature

To prevent kubelet from injecting the service discovery environment variables you
need to add `enableServiceLinks: false` to your pod spec. The reason why it's called
this way is because the environment variable service discovery was originally
related to now deprecated [docker link](https://docs.docker.com/network/links/) functionality.

It's unfortunate that this needs to be set for each pod as it's easy to omit it
for new pods and would be a fair amount of work to add it to existing pods if
there are a lot of them. The first problem could be fixed by writing an admission
controller or using something like [kyverno](https://github.com/kyverno/kyverno)
to change default to `false` or reject pods that don't have the value explicitly
specified.

---

**Note**: While I'm advocating against using this feature I'm not saying that
there are absolutely no cases where it should be used. However those situations
are rare and there are options I'd consider before turning to it, from statically
assigning service ips and using regular env variables/configmaps (if you absolutely
need to shave a millisecond from your p99 latency) to building an operator to
manage a certain aspect of service discovery for your specific use case (e.g. for
some reason you don't only need to obtain an ip address but a port as well since
it cannot be set statically for some reason).
