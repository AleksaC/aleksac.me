---
title: "Skipping Optional Arguments in ClickHouse Table Functions"
date: "2024-01-28T23:57:39+00:00"
---

Recently I had to insert data from JSON files stored in S3 into ClickHouse.
The files were gzipped, but didn't contain the `.gz` suffix, so ClickHouse kept
treating them as regular JSON files and throwing an error when trying to parse them.
When I looked at the signature of the [s3 table function](https://clickhouse.com/docs/en/sql-reference/table-functions/s3)
I noticed a problem.

```sql
s3(url [, NOSIGN | access_key_id, secret_access_key, [session_token]] [,format] [,structure] [,compression_method])
```

The `compression_method` argument I wanted to specify was behind two other arguments,
one of which I really didn't want to specify.

First I tried specifying the argument as you would in a programming language like Python.
Then I tried using Snowflake-style `=>` but it didn't work either. So I gave up
on named arguments and tried finding an alternative approach.

After  a decent amount of googling I stumbled upon this GitHub issue [comment](https://github.com/ClickHouse/ClickHouse/issues/54631#issuecomment-1719488328)
that looked promising, and indeed it was what I needed.
In my case the query looked something like this:

```sql
SELECT * FROM s3(
    '<bucket_url>',
    '<aws_access_key_id>',
    '<aws_secret_access_key>',
    auto,
    auto,
    'gz'
)
```

Since I couldn't find any details on `auto` in ClickHouse documentation other than
a passing reference in the [schema inference docs](https://clickhouse.com/docs/en/interfaces/schema-inference#table-functions-file-s3-url-hdfs),
I was wondering if it worked for all functions or just table functions.

I decided to test it on the first function with more than one optional argument I
come by. I ended up trying with [`makeDateTime64`](https://clickhouse.com/docs/en/sql-reference/functions/date-time-functions#makedatetime64),
but it didn't work.

```sql
SELECT makeDateTime64(2023, 2, 28, 17, 12, 33, auto, auto, 'Europe/Amsterdam');
```

So I guess, at least for now, we only get to use `auto` with table functions.
