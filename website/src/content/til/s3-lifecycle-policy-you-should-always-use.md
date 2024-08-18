---
title: "S3 Lifecycle Policy You Should Always Use"
date: "2024-05-12T18:53:02+00:00"
---

There's been a lot of talk about S3 costs [these](https://medium.com/@maciej.pocwierz/how-an-empty-s3-bucket-can-make-your-aws-bill-explode-934a383cb8b1) [days](https://twitter.com/jeffbarr/status/1790072050855588265).
Like with most other services, AWS makes it easy to accidentally give your money to them
with S3 as well. One way you can do this is by accumulating a bunch of incomplete [multipart uploads](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html).

The biggest issue with incomplete multipart uploads is that they are easy to miss.
Their storage cost doesn't show up as a separate item on your bill and you can't
see them in your bucket's UI. Unless you occasionally check your [storage lens](https://aws.amazon.com/s3/storage-lens/)
dashboards, for all you know, any amount of storage listed on your bill can be
from incomplete multipart uploads.

The way incomplete multipart uploads normally occur is when multipart upload gets
abruptly terminated. The good thing about them is that in these situations you
can continue where you left off, but most applications just start a new upload
instead. Sometimes you may not even be aware that you're using multipart uploads
as some tools, like aws cli when using `aws s3` command, automatically perform
multipart uploads for files past certain size.

Since S3 storage is cheap and incomplete multipart uploads should be produced at
a relatively low rate, they don't even amount to a rounding error for most people.
In addition to that, the risk of incomplete multipart uploads being used as a
vector for a denial of wallet attack is relatively low, since the attacker needs
to have permissions to upload the parts to your bucket.

So, if it's not an issue for most people in practice, why am I writing about this?
Mostly because you can completely eliminate the risk with basically no effort.
All it takes is an [S3 lifecycle rule](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-abort-incomplete-mpu-lifecycle-config.html).
In terraform it would look something like this:

```hcl
resource "aws_s3_bucket_lifecycle_configuration" "expire" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    id = "incomplete-multipart"

    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}
```
