---
title: "Stop putting this into your Python Dockerfiles"
description: |
    PYTHONDONTWRITEBYTECODE is useless at best and harmful at worst
date: '2022-10-16T21:47:37+00:00'
---

`ENV PYTHONDONTWRITEBYTECODE 1` is [very common](https://github.com/search?l=Dockerfile&q=%22ENV+PYTHONDONTWRITEBYTECODE+1%22&type=Code)
in python dockerfiles. However most of the time it is useless at best and harmful at worst.

### What does PYTHONDONTWRITEBYTECODE do

CPython doesn't execute the code directly. Instead it first compiles the code into
bytecode which is cached as `.pyc` files in `__pycache__` directory you know and hate.
Having cached the bytecode, the interpreter can skip the compilation of modules
that haven't changed. If for some reason you want to prevent python from caching
the bytecode, you can set [`PYTHONDONTWRITEBYTECODE`](https://docs.python.org/3/using/cmdline.html#envvar-PYTHONDONTWRITEBYTECODE)
environment variable to a non-empty string.

### Why include it in dockerfiles

The first thing that comes to mind when thinking about potential problems with
caching things is the possibility of getting a stale version of the resource we
are caching. Since code doesn't change during container runtime (unless you are
doing some weird stuff) this is unlikely to cause any problems and can be ruled
out as a reason to disable bytecode caching in containers.

Another potential issue is that pycs are not deterministic by default, which is
explained in more detail and addressed by the [PEP-552](https://peps.python.org/pep-0552/).
This can certainly be fixed by not generating the pycs at all but this can also be
fixed by using a different validation mode (e.g. by setting `SOURCE_DATE_EPOCH`
environment variable). In addition to that most people don't really care about
perfect reproducibility in their image builds. They only build new images once
when something changes, relying on cache from previous builds to avoid rebuilding
layers whose dependencies didn't change.

Finally the most likely motivation behind putting `PYTHONDONTWRITEBYTECODE` in
dockerfiles is to reduce the size of the image. Since we want to make our images
as small as possible it may make sense not to store the cache files.
However in most cases `PYTHONDONTWRITEBYTECODE` saves us **NOTHING AT ALL!**

### pip doesn't care about this option

Since you usually aren't running your app during the build process, no `pyc` files are
generated for your code. Now you need to peek into a freshly created vritualenv
to see if they are generated for your dependencies during installation. If you
do that you'll see that they indeed are and maybe your project has a lot of them,
so eliminating them could surely shave off some MBs from your image. However you'll
be disappointed to find out that this doesn't happen when you set `PYTHONDONTWRITEBYTECODE=1`:

```shell
export PYTHONDONTWRITEBYTECODE=1
virtualenv venv
. venv/bin/activate
pip install django
find . **/django/**/*.pyc
```

It should come as no surprise though, as pip doesn't generate the bytecode by importing the
packages but by [explicitly compiling](https://github.com/pypa/pip/blob/a8ba0eec6ac3c1f6cf23f1e2e4c64954bd7a08ed/src/pip/_internal/operations/install/wheel.py#L615)
them. To prevent this you can pass [`--no-compile`](https://pip.pypa.io/en/stable/cli/pip_install/#cmdoption-no-compile)
flag to `pip install`. `poetry`, on the other hand, does the opposite by default
since version `1.4.0` (prior to that version you had [no way](https://github.com/python-poetry/poetry/issues/2288)
of preventing it from generating the pycs) and instead exposes a [`--compile`](https://python-poetry.org/docs/cli/#options-2)
flag to perform the compilation.

### How much does it save you

As explained above, `PYTHONDONTWRITEBYTECODE` doesn't save you anything, but
running `pip install` with `--no-compile` or a regular poetry install will net
you decent savings on a decently-sized project. For example on an 18K LOC fastapi
monolith I have at work, running poetry install without `--compile` saves `63MB`,
which is almost a 15% reduction in image size. This obviously doesn't come for
free, so let's explore the downsides.

### How it hurts you

Not generating means the modules need to be compiled during import time.
Since most imports occur at startup this means that disabling bytecode caching
mostly impacts the startup of the application. This is especially bad if you are
using a pre-fork WSGI server like [Gunicorn](https://gunicorn.org/) without [preloading](https://docs.gunicorn.org/en/stable/settings.html#preload-app)
the app because each worker will need to go through the full compilation process,
wasting CPU cycles and slowing down the worker startup. It will also impact worker
restarts if you used something like gunicorn [max-requests](https://docs.gunicorn.org/en/stable/settings.html#max-requests)
in your config. Another issue is that some dependencies may not be imported during
the app startup, leading to them being imported when the first request hits a route
that uses them leading to unexpected latency spikes. Heavy dependencies like
pandas and numpy which take ages to import even with the bytecode cache compiled,
can easily add a couple of seconds to the action that first triggered their import.

### TL;DR

You probably want `pip install --no-compile` instead of  `PYTHONDONTWRITEBYTECODE=1`,
even though you probably shouldn't use either one of them.
