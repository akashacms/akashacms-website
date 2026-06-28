---
layout: blog.html.njk
title: Announcing AkashaCMS v0.9.6 - many more improvements over 0.9
publicationDate: September 14, 2025
blogtag: news
teaser: |
  After a lot of experimentation and rearchitecting, AkashaCMS 0.9 is now available.  And, we kept on rolling with improvements.
heroPicture:
---

The theme following the 0.9 release was - Why the heck is this thing still so slow.  Rather, performance improvements, as well as tooling for measuring performance data.

## Changing the SQLITE3 implementation

One major change has to do with the SQLITE3 implementation.  The initial implementation used SQLITE3ORM to simplify database access.  I don't know if that made for a negative performance impact, however there were other reasons for eliminating SQLITE3ORM.  It was clumsy to use, and I wanted to use GENERATED columns in the database matching data stored in JSON objects.

SQLITE3 supports storing JSON as a TEXT field in the database.  To access a field of a JSON object, an SQL command must use an extension function like `json_extract`.  This means JSON objects are being repeatedly parsed to extract or set JSON values.  While it's flexible to store unstructured JSON data in SQLITE3 tables, constantly reparsing or serializing JSON is going to be slow.

For example, these two fields are widely used:

```sql
`layout` TEXT GENERATED ALWAYS
    AS (json_extract(metadata, '$.layout')) STORED,
`blogtag` TEXT GENERATED ALWAYS
    AS (json_extract(metadata, '$.blogtag')) STORED,
```

The data is stored in the JSON stored in the `metadata` field.  The `GENERATED ALWAYS` clause says to extract those fields once, and to store the result in the table as regular columns that can be indexed and queried directly.

This change should have produced a performance result.  But, I didn't have the capacity to make measurements.  More on that in a few paragraphs.

## Measuring SQL query performance

The sub-theme of improving the ability to make accurate performance measurements is important.  I wasn't satisfied with what I saw for profiling tools.  The plan emerged to accurately measure the things which needed to be improved.

For example, how does one know whether their SQL queries perform well or not?  In the big-name databases like MySQL, there is a slow query log.  SQLITE3 doesn't have one.  But, the `node-sqlite3` module does have an `on('profile')` hook for measuring the time required for each SQL command.

After some work on that hook, I developed a standalone package - [sqlite3-query-log](https://www.npmjs.com/package/sqlite3-query-log) - which captures the miliseconds required to execute each SQL command, as well as a couple of analysis tools.

With that tool, I could see the slow queries, and develop ways to improve their performance.

## Improved rendering results and perfresults report

One tool that now exists in Node.js is the performance hooks.  This is a large set of tools, most of which is not being used in AkashaRender.  The part which is used is `performance.now()`, which offers a high resolution timestamp.

The incumbent results format used verbose output and low resolution timestamps:

```
HTML index.html.md ==> index.html (1.93 seconds)
/index.html.md out FIRST RENDER 0.004 seconds
/index.html.md out SECOND RENDER 0.057 seconds
/index.html.md out MAHABHUTA 1.925 seconds
/index.html.md out RENDERED 1.93 seconds
```

The entire rendering pipeline was rewritten for code cleanliness, and to use `performance.now()` high resolution timestamps.

The output format now looks like:

```
HTML img2resize-nunjucks.html.md ==> img2resize-nunjucks.html
FIRST 0.2857420000000275 LAYOUT 0.8803419999999278 MAHA 5.560613000000103 TOTAL 22.84083899999996
```

Further, using the `--perfresults perf.json` option outputs those performance measurements as JSON objects like this:

```json
{
    "renderedPath": "hier/dir1/dir2/index.html.md",
    "format": "HTML",
    "time": 1232.559278,
    "first": 1.3062750000001415,
    "second": 6.272641999999905,
    "mahabhuta": 69.80545799999982,
    "rendered": 90.35059000000001
},
```

These time measures are now elapsed time for the segment of time, while TOTAL is the start to finish elapsed time.

## Enforcing SQL injection

I used the Claude AI tool to scan for SQL injection attacks in AkashaRender.  All such avenues were blocked.

A key thing is that each SQL command is now a separate file with a `.sql` extension.  Those files are read into memory using `fs.readFile`, and then normal SQL parameter substitution is used to insert values into the strings.  The SQLITE3 driver ensures that such inserted parameters are automatically quoted directly to prevent SQL injection attacks.

## Using Joi for data validation

For some of the data types in the cache, Joi validation schema's have been written.  These schemas are enforced at critical parts of processing data in the cache.

Implementing this validation turned up several bugs, and will contribute to greater stability.

## Summary

All these changes were implemented with no external API changes.

Instead these features contributed to internal stability and created the potential for performance improvements to come.

