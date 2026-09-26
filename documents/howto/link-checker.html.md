---
layout: how-to.html.njk
title: Checking links in a rendered site
rightsidebar:
author: david
publicationDate: August 16, 2026
---

You build the site, the pages all render, and then — somewhere in the content there — a link goes to a page you renamed, deleted, or never created. You don't find out until a reader clicks it and sees "404 — not found".

AkashaRender can catch those before you publish by using the link checker.  This module runs at the end of a render, walks every HTML page written to the rendering directory, to check the links.  There are four operation modes that can be configured from ignoring bad links entirely to making any bad link a fatal error.

The link checker is part of the built-in plugin.  There is no plugin to install — you just add a small configuration block to `config.mjs`.

## Three types of links to check

There are three kinds of links where each require different treatment.  You can tell the checker how to treat each one separately.

* **Internal** — a link to a page or asset inside your own project.  The checker looks it up in the file cache, which knows every document and asset that was rendered.  No network is involved, so this is fast and reliable.  A page you renamed and a `stylesheet.css` that stopped existing both get caught here.
* **External** — an outbound link another website, for any `http://` or `https://` URL.  The checker makes a real HTTP request and inspects the response.  Because other people's sites are slow or unpredictable, this is treated more gently — and is off by default.
* **Non-HTTP** — anything else, such as `mailto:`, `tel:`, or `sms:`.  These can't be checked over the web, so by default they are skipped.  You can ask for them to be listed so you can skim over them.

A bare `#anchor` link that just jumps to a spot on the same page is never a problem and is ignored.

## Enabling link checking

Link checking is enabled and configured by setting options on the Built-in plugin.

```js
config.plugin('akashacms-builtin').checkLinks = {
    // set options here
};
```

The simplest useful configuration checks internal links and fails the build on a broken one:

```js
config.plugin('akashacms-builtin').checkLinks = {
    internal: 'error'
};
```

That `checkLinks` object is the whole configuration surface for this feature.  `internal`, `external`, and `reportOtherSchemes` each take one of four **modes** — `ignore`, `warn`, `error`, or `fatal` — that you will see next.  If you leave a field out, it falls back to its default — `internal` defaults to `warn`, while `external` and `reportOtherSchemes` default to `ignore` (off).

The full configuration object is `LinkCheckOptions` located in `lib/link-checker.ts` in the akasharender source.

## The four link checking modes

For internal and external the checking mode is defined separately:

```js
config.plugin('akashacms-builtin').checkLinks = {
    // Links to internal resources
    internal: 'error' // or ignore, warn, or fatal
    // Outbound links to external resources
    external: 'error' // or ignore, warn, or fatal
    // non-HTTP(s) links
    reportOtherSchemes: 'ignore' // or error, warn, or fatal
};
```


* **`ignore`** — do not check this class at all.  Nothing is looked up, nothing is reported.  This is also how you turn the feature off.  If every class is `ignore`, the checker does nothing.
* **`warn`** — check them, print a warning for each bad one, and keep going.  The build still succeeds.  A good fit for internal links while you are actively editing content.
* **`error`** — check them, print an error for each bad one, and keep going — but after the last link has been checked, the build fails.  This gives you a complete list of every problem in one run, which is exactly what you want in a CI build, because you are not stuck fixing one and rebuilding to find the next.
* **`fatal`** — stop at the very first bad link and fail right away.  Fastest feedback while you are editing, at the cost of one problem at a time.

The difference between `error` and `fatal` is simply when the build stops: `error` collects every problem and stops at the end; `fatal` stops at the first one.

The output looks like this:

```text
$ npx akasharender render config.mjs
...
WARNING: Link check (internal): internal link not found (/about/team.html) — ./team.html in /docs/about/index.html
ERROR: Link check (external): external link broken (HTTP 404) — https://example.com/old-page in /docs/research/index.html
```

Each line names the class of link, why it failed, the link itself, and the page it was found in.  With modes set to `error` or `fatal`, the build then fails, and in the `error` case the failure message lists every bad link it found.

## Checking external links — and the whitelist

Once your internal links are reliable, you may want external checking too.  Just set the `external` mode:

```js
config.plugin('akashacms-builtin').checkLinks = {
    internal: 'error',
    external: 'warn'
};
```

Checking external links requires making an HTTP(s) request on the external resource.  That takes both time, and is not entirely reliable.

A `200` (or a success redirect) is fine, a clear `404`/`410` is reported as broken, and the ambiguous cases — a `403` bot-block, a `429` rate-limit, a `5xx` server error — are reported softly as "probably alive, but the checker got blocked".

Here is the honest part: external checking is noisy.  Sites behind Cloudflare or other bot protection, sites behind a login, and servers that rate-limit automated requests will all refuse or fail the check even though the link works perfectly in a browser.  You do not want those cluttering your build.

For those, there is the `whitelist`.  List the offending domains, and they are assumed valid and never fetched:

```js
config.plugin('akashacms-builtin').checkLinks = {
    external: 'warn',
    whitelist: [
        'linkedin.com',              // matches that host and any subdomain
        'twitter.com',
        /^https:\/\/www\.amazon\./  // or a regular expression against the URL
    ]
};
```

A whitelist entry can be a **domain** (which also covers its subdomains), an exact or prefix **URL** string, or a **regular expression**.  The whitelist is a different tool from `ignore`: `ignore` switches off entire classes of checking, while the whitelist simply excuses specific domains from an otherwise-enabled external check.

The link checker does cache results for external links.  A given external URL is only fetched once per run even if ten pages link to it, and repeated renders within an hour reuse the last result.

## A complete, realistic block

Putting it together, a site author might write:

```js
config.prepare();

config.plugin('akashacms-builtin').checkLinks = {
    internal: 'error',              // broken page/asset links fail the build
    external: 'warn',               // flag flaky/dead outbound links, but keep going
    reportOtherSchemes: 'warn',     // list mailto:/tel:/... links for a quick skim
    whitelist: [
        'linkedin.com',
        /^https:\/\/www\.amazon\./
    ]
};
```

Or the same thing, phrased as methods, if you prefer to build it up line by line:

```js
config.plugin('akashacms-builtin')
    .setInternalLinkMode(config, 'error')
    .setExternalLinkMode(config, 'warn')
    .setOtherSchemesMode(config, 'warn')
    .addLinkCheckWhitelist(config, 'linkedin.com')
    .addLinkCheckWhitelist(config, /^https:\/\/www\.amazon\./);
```

Both forms set the same `checkLinks` options.

## Using the `link-check` package for link checking, instead

By default, external links are checked with a small checker built into AkashaRender.  It requires no extra packages, and for most people that is the answer.

If you would rather use the well-established [`link-check`](https://www.npmjs.com/package/link-check) package — it adds a couple of extra capabilities, such as verifying `mailto:` addresses and checking page anchors.  AkashaRender does not bundle it; you install it in your own project and it is loaded on demand only when you ask for it.  So there is no cost for the built-in default.

**1.** Install it in the project that holds your `config.mjs`:

```shell
npm install --save-dev link-check
```

**2.** Point the checker at it:

```js
config.plugin('akashacms-builtin').checkLinks = {
    external: 'warn',
    externalChecker: 'link-check'
};
```

Everything else — the four modes, the whitelist, the duplicate and non-HTTP handling — works the same whether the external checker is the built-in `fetch` (the default, no install) or `link-check`.  If you set `externalChecker` to `'link-check'` but the package is not installed, you get a clear error telling you to `npm install --save-dev link-check` (or switch back to the built-in checker).

## Turning off link checking

There is no separate "enabled" switch.  Setting the modes to `ignore` is how you disable the checker:

```js
config.plugin('akashacms-builtin').checkLinks = {
    internal: 'ignore',
    external: 'ignore'
};
```

With that, the whole link-check step is skipped during a render, and it costs you nothing.

## Summary

The link checker lives in the built-in plugin and is configured with the `checkLinks` object (or the chainable setter methods) in your `config.mjs`.  Internal links are checked against the file cache, external links over HTTP, and non-HTTP links are skipped unless you ask to be shown them.  Each class is governed by one of four modes — `ignore`, `warn`, `error`, `fatal` — and the whitelist excuses the specific external domains that would otherwise give you false alarms.  For external checking you can use the built-in checker, or opt into the `link-check` package you install yourself.


Because checking external links adds to the rendering time, a good practice may be to disable it most of the time, like so.

```js
config.plugin('akashacms-builtin').checkLinks = {
    internal: 'error',
    external: 'ignore'

    // external: error,
    // whitelist: [ domains to ignore ]
};
```

A good practice may be to ignore external link checking most of the time.

Every so often you can change your configuration file to enable external link checking.

The formal reference for every option and its defaults is in the [AkashaRender guide](/akasharender/link-checker.html).
