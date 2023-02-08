---
title: "Building Container Images With Local Dependencies Outside Build Context"
date: "2023-01-19T00:50:24+00:00"
---

I'll illustrate this example with python apps but a similar project structure and
way of specifying dependencies can be found in other languages.

```text
my-project
├── apps
│   └── my-app
│       ├── Dockerfile
│       └── pyproject.toml
└── lib
    └── my-lib
```

`pyproject.toml` contains something along the lines of:

```toml
[tool.poetry.dependencies]
my-lib = { path = "../../lib/my-lib", develop = false }
```
To build a container image for `my-app` we would need to specify the entire
`my-project` as build context or use ugly scripts to temporarily put together the
things we need in the same build context. This can impact build performance if
the project grows very large or `.dockerignore` files aren't used to exclude stuff
like virtual environments. It can also be error-prone as code from other apps can
easily end up in our image if we aren't careful when copying the files.

Fortunately this can all be avoided by using [buildx](https://docs.docker.com/engine/reference/commandline/buildx_build/)
for building images. `buildx` allows us to use multiple build contexts and
mount the files from them while building the image. In our example `Dockerfile`
would contain something like this:

```dockerfile
# Workdir needs to be at least two levels deep here. In this case it also needs to
# be 3 levels deep from the root so it doesn't override /lib.
WORKDIR /my-project/my-app/deps

RUN --mount=target=../../lib,from=lib poetry install
```

Now we can run something like this:

```shell
docker buildx build --build-context lib=../../lib .
```

and voilà, we have our image!
