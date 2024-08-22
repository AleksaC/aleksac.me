---
title: "Astro Build Format and CloudFlare Pages"
date: "2024-08-22T18:51:05+00:00"
---

By default Astro uses `directory` [build format](https://docs.astro.build/en/reference/configuration-reference/#buildformat),
which generates directories with `index.html` for each page (e.g. `src/pages/about.astro`
becomes `src/pages/about/index.html`). This isn't an issue in and of itself. However,
there doesn't seem to be a standard for how these pages should be served.

When you navigate to `/about` you may get:
 - the content of `about/index.html`
 - a redirect to `/about/` which will then return the page content
 - a 404 page

CloudFlare Pages takes the second option. This means that all your links need
to end with a trailing slash in order to avoid unnecessary redirects. Thankfully
there is [an option](https://docs.astro.build/en/reference/configuration-reference/#trailingslash)
to enforce this in dev server so it's easier to catch. When you set `trailingSlash: 'always'`,
you'll get 404 when accessing the pages without a trailing slash during development.

Another option is to use `file` build format. This will generate an html file with
the appropriate name for each route (`about.html` in the example above). However
`Astro.url` will also include the `.html` extension which would once again lead
to a [redirect](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching),
and may cause issues if you're composing URLs. You can work around this by building
a wrapper around `Astro.url` that would strip the `.html` extension from the paths.
