---
title: "Prevent Accidental Installation of Packages Outside Virtual Environment"
date: "2023-01-08T22:14:28+00:00"
---

You may often find yourself accidentally installing packages to your global python
interpreter because you forgot to activate a virtual environment. Thankfully you
can make pip require virtualenv to be activated in order to perform the install.

There are two ways to do this: either by using an environment variable `PIP_REQUIRE_VIRTUALENV`
or by enabling `require-virtualenv` pip config option.

To make this a default globally either add the following to your `.bashrc`
(or `.zshrc` or whatever other rc you are using)


```bash
echo "export PIP_REQUIRE_VIRTUALENV=true" >> ~/.bashrc
```

or run the following command


```shell
python -m pip config set global.require-virtualenv true
```

Which will add something along the lines of

```ini
[global]
require-virtualenv = true
```

to your `~/.config/pip/pip.conf` (may be a different location on your system).

I prefer the second option as that way I don't clutter my `.bashrc` and if I add
new pip config entries they will all be in the same file. The second option
also works on Windows.

---

Setting this option globally will be useful most of the time but you may still
need to run commands for the global interpreter.

```console
$ pip freeze
ERROR: Could not find an activated virtualenv (required).
```

This can be easily achieved by adding `PIP_REQUIRE_VIRTUALENV=false` in front
of the command that's failing:


```console
$ PIP_REQUIRE_VIRTUALENV=false pip freeze
```
