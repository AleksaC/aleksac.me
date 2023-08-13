---
title: "Getting Query Backing a View in Clickhouse"
date: "2023-08-08T08:48:27+00:00"
---

Recently I inherited a clickhouse cluster and needed to look into the query backing
a materialized view. Since the view wasn't defined in the code I had to obtain it
from clickhouse itself. However I wasn't able to find in the clickhouse cloud UI
and a quick google search wasn't helpful either.

Then I remembered that relational databases hold that information inside the
information schema tables, so I checked to see if something like that is available
in clickhouse. Indeed it is, and here's the query to get the query behind a view:

```sql
SELECT
  table_schema, table_name, view_definition
FROM
  information_schema.views;
```
