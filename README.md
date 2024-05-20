# aleksac.me

Code behind my personal website, [aleksac.me](https://aleksac.me).

[![pre-commit](https://github.com/AleksaC/aleksac.me/actions/workflows/pre-commit.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/pre-commit.yml)
[![Spellcheck](https://github.com/AleksaC/aleksac.me/actions/workflows/spellcheck.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/spellcheck.yml)
[![Deploy](https://github.com/AleksaC/aleksac.me/actions/workflows/deploy.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/deploy.yml)
[![Lighthouse CI](https://github.com/AleksaC/aleksac.me/actions/workflows/lighthouse-ci.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/lighthouse-ci.yml)

## About

The website is built using [next.js](https://github.com/vercel/next.js) with [preact](https://preactjs.com/).
Since the website is simple and mostly static there were a lot of options to choose from.
I thought about using something like [astro](https://github.com/withastro/astro)
or maybe even going with a traditional static site generator like [hugo](https://github.com/gohugoio/hugo).
However I chose next because for the following reasons:

- I already knew it well
- client-side routing and route prefetching out of the box
- negligible overhead in terms of bundle size (`<50kB` of gzipped js on most pages)
- there's a decent template to get started with
- would scale well to a more complicated website

### Getting started

This website was tailored for my own use cases, so the code for it has never been
intended to be reused by anyone other than me. However if you'd like to hack on the
website or you think you can deal with my idiosyncrasies and would like to use
it as a base for your own website here's what you need:

- node 18+
- pnpm

You'd probably want to fire up a dev server to get started. Here's how to do that:

```
git clone https://github.com/AleksaC/aleksac.me
cd aleksac.me/website
make dev
```

If you don't like make you can replace the last command with standard `pnpm install`
and `pnpm run dev`.

### Infra

The website is deployed to cloudflare pages. It offers great performance as well
as availability across the globe for the low price of free. Preview builds are also
nice. The deployment is not done through cloudflare pages github integration.
I'm using github actions instead. This gets me:

- faster builds
- easier orchestration of other github actions (e.g. lighthouse ci)
- support for newer node versions
- I can use pnpm

In addition it required very little effort to set up and is unlikely to require
additional maintenance.

## Contact
- [Personal website](https://aleksac.me)
- <a target="_blank" href="http://twitter.com/aleksa_c_"><img alt='Twitter followers' src="https://img.shields.io/twitter/follow/aleksa_c_.svg?style=social"></a>
- hello@aleksac.me
