---
title: "Atomic Sync For Website Deployments to S3"
date: "2024-02-14T10:09:43+00:00"
---

Despite the growing popularity of static hosting solutions like Cloudflare Pages
and Netlify, an S3 bucket with a CDN in front of it is still a good choice for
hosting a static website.

Deploying to S3 is very simple and effectively boils down to a variation of the
following aws cli command:

```shell
aws s3 sync <website> s3://<bucket>
```

Unfortunately this is not an atomic operation, so if something breaks during the
sync or if the uploads are taking a long time, you will be left in an inconsistent
state.

For example a new version of an html page might have been uploaded but the
corresponding styles, javascript or images haven't.

Luckily this can be fixed easily - we just need to upload the assets first and
the pages after that.

For a React Vite SPA the commands would look something like this:

```shell
aws s3 cp dist s3://<bucket_name> --recursive --exclude index.html
aws s3 sync dist s3://<bucket_name> --delete
```

The same principle applies to any type of website as long as you can separate the
pages from the rest of the assets.

For websites with multiple pages you can still encounter issues like broken links
due to referencing pages that haven't been uploaded yet, but you won't have broken pages.
