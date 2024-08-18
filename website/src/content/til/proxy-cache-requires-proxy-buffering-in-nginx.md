---
title: "Proxy Cache Requires Proxy Buffering in Nginx"
date: "2023-03-25T23:58:58+00:00"
---

Official nginx [docs on proxy caching](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache)
as well as most of the guides on the topic don't mention that it only works if
[proxy buffering](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering)
is enabled. This may be due to the fact that it's enabled by default.

However from my experience proxy caching has been mostly useless and I usually turn
it off to get the extra bit of performance, and only enable it for locations where
I use caching.

In addition to that, it is also disabled by default in ingress nginx so it also
needs to be enabled for the rules where caching is enabled.
