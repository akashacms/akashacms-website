---
layout: how-to.html.njk
title: Building and validating a sitemap
rightsidebar:
author: david
publicationDate: August 16, 2026
---

An XML Sitemap is a file that lists all the pages of your site.  It is meant for for search engines, informing them of your sites valid pages.  Google, Bing, and the rest fetch your sitemap to learn, in bulk, what is on the site and how it is laid out.  They may use the dates in it to decide what to re-check.

The formal description for the XML Sitemap format is at https://www.sitemaps.org/.  The short version is: a sitemap tells the crawlers "here is the complete list of my pages, and when each one last changed."

It is best to publish a correct sitemap.  A sitemap listing pages that are gone, or that is malformed, is a small but real mark against you.  Search engines read sitemaps partly as a signal of how well cared-for a site is.  A broken one can contribute to a lower-ranking, if only as one more sign of low credibility.  It is the sort of thing nobody complains about — it just quietly holds you back.

AkashaRender can build the sitemap for you as part of a normal render, automatically announcing the sitemap in every page of the website.  It can also check a sitemap for validity.

## Enabling XML Sitemap generation

Sitemap generation is supplied by the `@akashacms/plugins-base` plugin, because it is a general website concern rather than an AkashaRender-internal one.  It is controlled by a single flag.  In the configuration, when you add the base plugin, set `generateSitemapFlag`:

```js
import { BasePlugin } from '@akashacms/plugins-base';

config
    .use(BasePlugin, {
        generateSitemapFlag: true
    });
```

If you would rather set it like the other base plugin options:

```js
config.plugin('@akashacms/plugins-base').generateSitemap(config, true);
```

That is the whole switch.  There are no per-page settings to make and nothing to install (the plugin is already a dependency of nearly every AkashaCMS site).  When you render, AkashaRender calls the plugin's `onSiteRendered` hook, and the plugin's `#generateSitemap` method runs and writes the file into your output directory.

## What it actually produces

The flag does more than write a single file.  Looking at a real render, the base plugin emits a *sitemap index* and at least one *sharded sitemap*:

```text
out/
    sitemap-index.xml.gz
    sitemap-0.xml.gz
```

The **index** lists the sitemap files, and each **shard** is a plain list of `<url>` entries.  They are compressed with gzip, and the entries are split across shards (the default limit is fifty thousand URLs per shard) so a very large site does not produce one giant file.  It is the structure described at https://www.sitemaps.org/protocol.html#sitemapindexdef.

Each entry in a shard looks like this:

```xml
<url>
    <loc>https://akashacms.com/howto/link-checker.html</loc>
    <lastmod>2026-08-16T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
</url>
```

`changefreq` and `priority` are set to sensible defaults.  `lastmod` is real: it is the last-modified time of the content file behind that page, which is exactly the "when did this actually change" signal the crawlers want.  Only pages rendered to HTML get an entry — assets and other output types are not listed.

One consequence of sharding and gzip: the *canonical* thing to hand to Google is the index, `sitemap-index.xml.gz`, because it references the shards.  

Hence, the URL for your sitemap is: `https://your.domain/sitemap-index.xml.gz`.

## Advertising the sitemap on your pages

A sitemap only really helps once the crawlers know where to find it.  The convention is a `<link>` tag in the `<head>` of your pages:

```html
<link rel="sitemap" type="application/xml" title="..." href="/sitemap-index.xml"/>
```

This is the [rel-sitemap microformat](http://microformats.org/wiki/rel-sitemap).

You could simply put this in your layout templates as-is.  Or, you could make a partial template for this sitemap snippet.  Or, the `@akashacms/plugins-base` provides a small helper function.

The helper function is invoked this way in an EJS template:

```ejs
<%- config.plugin('@akashacms/plugins-base').doGoogleSitemap(locals) %>
```

That is, first retrieve the Plugin object (`config.plugin('@akashacms/plugins-base')`) then call its `doGoogleSitemap` function.  Most of the template engines provide a way to call functions like this.

In an NJK template there is a predefined macro for this purpose:

```
{{ ak_core.XMLSitemap("/sitemap.xml") }}
```

That is the "add a sitemap link to a page" function in the base plugin — `doGoogleSitemap` — and it fills in the page title and an href pointing at the sitemap index (it defaults to `/sitemap-index.xml`, so adjust that if you point crawlers at the compressed `sitemap-index.xml.gz`).

## Validating a sitemap

AkashaRender ships a `validate-sitemap` command, and the point is to catch mistakes in the sitemap — a page that was deleted but is still listed, a URL that does not match the site, a missing namespace — *before* they reach a crawler.

It works against your rendered output.  You run it in the same project directory:

```shell
npx akasharender validate-sitemap config.mjs
```

It picks up the sitemap in your output directory, the one named `sitemap.xml` by default, and checks two things:

* **The XML is well-formed** — the right `http://www.sitemaps.org/schemas/sitemap/0.9` namespace, an opening XML declaration, a `<urlset>` (or `<sitemapindex>`) root, and at least one `<loc>` element.  These are the things that make a sitemap readable at all.
* **Every listed URL exists.**  It maps each `<loc>` back to a file in your output directory and confirms the file is actually there.  A page that used to exist and got renamed or deleted shows up here as a missing file, which is exactly the problem you do not want shipped.

You point it at a different file with `--sitemap`, get a machine-readable report with `--json`, and make a build fail on any problem with `--strict`:

```shell
# Check a non-default sitemap name
npx akasharender validate-sitemap config.mjs --sitemap my-sitemap.xml

# Check a compressed sitemap
npx akasharender validate-sitemap config.mjs --sitemap sitemap-index.xml.gz

# Fail the build if anything is wrong
npx akasharender validate-sitemap config.mjs --strict

# Print a JSON report for scripting
npx akasharender validate-sitemap config.mjs --json
```

A clean run looks like this:

```text
Sitemap Validation Report
=========================

Sitemap: out/sitemap.xml
Total Entries: 142
Valid Entries: 142
Invalid Entries: 0

XML Validation: ✓ Valid
  - Namespace: ✓ Correct
  - Well-formed: ✓ Yes

Summary: ✓ Validation passed
```

A run that catches a problem names the offending entry and the file it expected to find:

```text
Sitemap Validation Report
=========================

Sitemap: out/sitemap.xml
Total Entries: 142
Valid Entries: 140
Invalid Entries: 2

Missing Files:
  ✗ out/blog/2019/01/old-post.html
    URL: https://akashacms.com/blog/2019/01/old-post.html
  ✗ out/plugins/legacy.html
    URL: https://akashacms.com/plugins/legacy.html

XML Validation: ✓ Valid

Summary: ✗ Validation failed: 2 invalid entries, 0 errors
```

## Putting it together

There are three pieces, and they fit together naturally.

1. **Generate.**  Set `generateSitemapFlag: true` on the base plugin.  On every render you get a correct, sharded, gzipped sitemap plus its index in the output directory, with real `lastmod` dates.
2. **Check it.**  Run `npx akasharender validate-sitemap config.mjs` after a render (and add `--strict` in CI so a broken sitemap fails the build) to confirm the structure is valid and that every listed page is actually there.
3. **Advertise it.**  Put a `<link rel="sitemap">` tag in your layout via `doGoogleSitemap`, so the crawlers know where the index lives.

Do all three and you get one of the quiet, unglamorous parts of a professional site done right: a sitemap that is complete, current, and trusted.  And because the checking runs through the same tool you already build with, there is no extra toolchain to maintain.
