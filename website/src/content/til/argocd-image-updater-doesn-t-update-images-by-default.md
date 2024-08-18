---
title: "ArgoCD Image Updater Doesn't Update Images by Default"
date: "2024-07-20T11:33:36+00:00"
---

The title is misleading, but only slightly, since ArgoCD Image Updater only updates
"active" images, where active means exported in the status of the ArgoCD application,
and ArgoCD exports images that have had pods with containers using them.

This means that workloads with zero initial replicas won't be updated until they
are scaled up and images used by pods created from custom resources that aren't
tracked by ArgoCD won't ever be updated. This also means images used by `CronJob`
won't be updated until it's executed for the first time, and if it doesn't keep
any history (both `successfulJobsHistoryLimit` and `failedJobsHistoryLimit` are
set to zero) the images won't be updated until it starts executing.

I lost an hour debugging why Image Updater wasn't pushing an update for a service
I deployed that was scaled to zero initially. Looking at the logs I saw an obscure
error, which later turned out to be unrelated to my issue, but lead me down the
wrong path as I spent a decent amount of time investigating it.

Since I couldn't find anything useful, I decided to look at the Image Updater code
and quickly figured out that why it wasn't pushing the updates. It also turned
out that I could have learned [this](https://argocd-image-updater.readthedocs.io/en/stable/configuration/images/#forcing-image-updates)
from the documentation had I been more thorough in reading it.

While I get why it would make sense to grab images from the ArgoCD app status, I
don't think it's a good default. When I put an image in the Image Updater image
list, I expect it to be updated when it changes. Not updating images that aren't
used is an optimization at best.

In some cases an image may be included in the image list by mistake (e.g. when
copying from a previous manifest and forgetting to remove it) or it may stop
being used but not removed from the image list. Even in those situations, skipping
the image update isn't really a solution, as I'd prefer to remove these images
completely. So it would make more sense to have Image Updater keep track of
unused images and expose it as metric so it can be alerted on.

After some more digging, I found an [old issue](https://github.com/argoproj-labs/argocd-image-updater/issues/322)
that mentioned changing the default behavior, but there was no activity on it since
it was opened. Hopefully it gets picked up at some point, but until then I suggest
using the `force-update` annotation for all your images.
