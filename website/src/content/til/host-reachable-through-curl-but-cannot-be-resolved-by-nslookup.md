---
title: "Host Reachable Through cURL but Cannot Be Resolved by nslookup"
date: "2023-01-11T01:11:31+00:00"
---

Recently I was doing some weird shit with docker and docker compose that required
a weird DNS setup. While debugging a problem with DNS resolution in nginx I came across
a strange issue: I could reach a host by curl and ping but wasn't able to resolve
it using nslookup and dig.

A quick Google search wasn't really helpful so I decided to run `strace` on both
tools and see if there's an obvious difference in how they handle name resolution.
After looking at the trace I finally spotted the difference: curl was opening
`/etc/hosts` and dig wasn't!

Turns out [`extra_hosts`](https://docs.docker.com/compose/compose-file/compose-file-v3/#extra_hosts)
is adding hostnames to the `/etc/hosts` file which isn't checked by the DNS tools or
nginx resolver.
