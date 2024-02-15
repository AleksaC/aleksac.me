---
title: "Getting Query Backing a View in ClickHouse"
date: "2023-08-08T08:48:27+00:00"
---

Recently I inherited a ClickHouse cluster and needed to look into the query backing
a materialized view. Since the view wasn't defined in the code I had to obtain it
from ClickHouse itself. However I wasn't able to find in the ClickHouse cloud UI
and a quick google search wasn't helpful either.

Then I remembered that relational databases hold that information inside the
information schema tables, so I checked to see if something like that is available
in ClickHouse. Indeed it is, and here's the query to get the query behind a view:

```sql
SELECT
  table_schema, table_name, view_definition
FROM
  information_schema.views;
```

**UPDATE**: There is an even better way to do what we want by using [`SHOW CREATE`](https://clickhouse.com/docs/en/sql-reference/statements/show#show-create-table--dictionary--view--database),
which returns the create query that could be used to create the view:

```sql
SHOW CREATE VIEW <view_name>;
```
