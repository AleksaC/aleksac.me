# aleksac.me

Code behind my personal website, [aleksac.me](https://aleksac.me).

## About

The website is built using [Astro](https://github.com/withastro/astro), without additional frameworks.

The first version of the website was built with [Next.js](https://github.com/vercel/next.js)
and [Preact](https://preactjs.com/). It was what I knew best at the time, and using
Preact with a compat layer instead of React in production builds kept the bundle
size within the acceptable range. This was before Next 13, which introduced
some major changes that made it hard for me to keep my existing setup, and in general
moved in a completely different direction from the stuff I needed for this website.

For this reason I decided to look for an alternative. The things I was looking for were:
- JSX
- clientside routing and route prefetching
- small bundle size
- as little dependencies as possible
- decent level of adoption and stability

Astro fit these (almost) perfectly, so I decided to test it and reimplement a subset
of functionality I had in the Next version of the website. This went smoothly, so
I rewrote the entire website in less than a week.

## Getting started

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

## Infra

The website is deployed to [Cloudflare Pages](https://pages.cloudflare.com/).
It offers great performance and unlimited bandwidth for the low price of free.
Preview builds are also nice.

The deployment is not done through their GitHub Integration. I'm using GitHub Actions instead.

This gets me:

- faster builds
- easier orchestration of other GitHub actions (e.g. Lighthouse CI)
- more flexibility in the build process
- support for newer node versions
- pnpm support (it is supported now but wasn't initially)

at the cost of:

- spending a little time writing and maintaining the GitHub workflow
