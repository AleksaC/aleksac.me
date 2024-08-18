# aleksac.me

Code behind my personal website, [aleksac.me](https://aleksac.me).

[![pre-commit](https://github.com/AleksaC/aleksac.me/actions/workflows/pre-commit.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/pre-commit.yml)
[![Spellcheck](https://github.com/AleksaC/aleksac.me/actions/workflows/spellcheck.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/spellcheck.yml)
[![Deploy](https://github.com/AleksaC/aleksac.me/actions/workflows/deploy.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/deploy.yml)
[![Lighthouse CI](https://github.com/AleksaC/aleksac.me/actions/workflows/lighthouse-ci.yml/badge.svg)](https://github.com/AleksaC/aleksac.me/actions/workflows/lighthouse-ci.yml)

## About

The webiste is built using [Astro](https://github.com/withastro/astro), without
additional frameworks like React.

The first version of the website was built with [Next.js](https://github.com/vercel/next.js)
and [Preact](https://preactjs.com/). This was before Next 13, which introduced
some major changes. It wasn't easy for upgrade the version, and preact compat was
no longer supported.

Since Next.js was moving in a completely different direction from the stuff I needed
for this website, I started looking for alternatives. The things I was looking
for in a new framework were:

- JSX
- clientside routing and route prefetching
- decent level of adoption

Astro fit these perfectly, and the rewrite process was going smoothly for a subset
of functionallity, so I decided to do a full rewrite.

### Getting started

This website was tailored for my own use cases, so the code for it has never been
intended to be reused by anyone other than me. However if you'd like to hack on the
website or you think you can deal with my idiosyncrasies and would like to use
it as a base for your own website here's what you need:

- node 20+
- pnpm 9+

You'd probably want to fire up a dev server to get started. Here's how to do that:

```
git clone https://github.com/AleksaC/aleksac.me
cd aleksac.me/website
make dev
```

If you don't like Make you can replace the last command with standard `pnpm install`
and `pnpm run dev`.

### Infra

The website is deployed to [Cloudflare Pages](https://pages.cloudflare.com/).
It offers great performance as well as availability across the globe for the low
price of free. Preview builds are also nice.

The deployment is not done through cloudflare pages github integration.
I'm using GitHub Actions instead.

This gets me:

- faster builds
- easier orchestration of other GitHub actions (e.g. Lighthouse CI)
- more flexibility in the build process
- support for newer node versions
- pnpm support (it is supported now but wasn't initially)

at the cost of:

- spending a little time writing and maintaing the GitHub workflow

## Contact
- [Personal website](https://aleksac.me)
- <a target="_blank" href="http://twitter.com/aleksa_c_"><img alt='Twitter followers' src="https://img.shields.io/twitter/follow/aleksa_c_.svg?style=social"></a>
- hello@aleksac.me
