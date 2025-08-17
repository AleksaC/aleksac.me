---
title: "GitHub Actions Support YAML Anchors"
description: ""
coverImage: ""
date: "2025-08-17T10:07:08+00:00"
---

It's been a long time coming, but GitHub actions support YAML anchors. This isn't
that big of deal as there are better ways to reuse code, but it's useful in some
cases like reusing paths in different triggers, like I do in deploy workflow for
this website:

```yaml
on:
  workflow_dispatch:
  push:
    paths: &paths
      - "website/**.[tj]sx?"
      - "website/**.css"
      - "website/**.astro"
      - "website/public/**"
      - "website/**.md"
      - "website/package.json"
      - "website/pnpm-lock.yaml"
      - "website/tsconfig.json"
      - ".github/workflows/deploy.yml"
    branches:
      - main
  pull_request:
    paths: *paths
    branches:
      - main
```

Merge keys (represented using `<<:`) are not supported though, so it's not possible
to use this to "extend" objects.
