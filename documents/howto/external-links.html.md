---
layout: how-to.html.njk
title: Controlling outbound links
rightsidebar:
author: david
publicationDate: August 18, 2026
---

Web sites routinely point to resources on other sites — reference links, cited articles, product pages, social profiles, and tools you recommend.  Every one of those outbound links is a little decision: where should the reader land, what should it signal to the search engines, and how should it look?

These decisions are worthy of deliberate consideration, and include:

* **Where it lands.**  Should an outbound link open in a new tab so the reader does not lose your page, or in the same tab where a slow or dead third-party site replaces everything they were looking at?
* **What it signals.**  A `rel="nofollow"` attribute tells search engines "do not give this site any ranking credit for my link."  That matters for affiliate links (which are expected to be nofollow) and for links to sites you do not want implicitly endorsing.
* **How it looks.**  A small favicon next to the link, or a generic "external link" glyph, makes an outbound link *read* as an outbound link.  A reader who can tell at a glance that a link leaves the site is a reader who is less surprised and less likely to wander off.

The `@akashacms/plugins-external-links` plugin is where all three are configured.  It scans every link in each rendered page, and for the ones that point off your site it rewrites the `<a>` tag — adding whatever target, rel, and icon markup you asked for.  Local links are left exactly as-is, so there is nothing to opt out of on your own pages.

Here is how you set it up and configure each area.

## Adding the plugin

It is an ordinary AkashaCMS plugin, so it is added like any other.  In `package.json`:

```json
"dependencies": {
    "@akashacms/plugins-external-links": "^0.10.x"
}
```

As of this writing, the plugin is not available in NPM and therefore the dependency must be recorded as:

```json
"dependencies": {
    "@akashacms/plugins-external-links": "akashacms/akashacms-external-links#0.10"
}
```

This retrieves the plugin from the correct branch in its GitHub repository.

Run `npm install`, then register it in `config.mjs`:

```js
import { ExternalLinksPlugin } from '@akashacms/plugins-external-links';

config
    // ...
    .use(ExternalLinksPlugin);
```

Even with no further configuration the plugin is now active and harmless — it defaults to turning *everything off* (no nofollow, no new tabs, no icons), so adding it will not change your pages until you ask it to.  That makes it safe to add and then turn each area on piece by piece.

The options can be set either as an options object at the point of `.use(...)`, or with the plugin's setter methods.  The setter style is easier to read and to turn one knob at a time, so the examples below use it:

```js
config.plugin('@akashacms/plugins-external-links')
    .setTargetBlank(config, true);
```

## Opening outbound links in a new tab

This covers the case of what happens when a visitor clicking on an outbound link: Does the link open in the same browser tab, or a new browser tab?

As the website author are you concerned about whether the visitor will return to your site?  Put another way, how do you encourage the visitor to stay on your site while still visiting the other site.

Opening in a new tab keeps your site still alive in their browser.

But, as the website author you may worry whether adding another tab to the visitors browser will irritate that visitor.

There is a single switch for this:

```js
config.plugin('@akashacms/plugins-external-links')
    .setTargetBlank(config, true);
```

With that on, every external link gets `target="_blank"`, while every internal link is left alone.

One note of caution: browsers increasingly treat "open in new tab on a user click" as something they only honor in a handful of safe situations.  A bulk `target="_blank"` on links you do not own is itself a mild signal to some crawlers.  It is a reasonable default for a content site, but it is a judgment call.

## Showing the destination's favicon

This is the most visibly "useful" feature.  It places a visual indication next to a link showing the destination site's favicon — that little site identity mark.  Someone reading the web page can not only quickly see which are the outbound links, but have a visual clue what the destination site is.

```js
config.plugin('@akashacms/plugins-external-links')
    .setShowFavicons(config, "before");
```

`"before"` puts the icon before the link text; `"after"` puts it after.  Any other value — or the default — leaves favicons off.

The important thing about this one is *where the icon comes from*.  

There are third-party favicon service that can be used to retrieve the favicon.  But, those third party services run in the visitors web browser, which then opens the door to our visitors being tracked by those services.

As a responsible website author it is perhaps best to respect our visitors privacy, and avoid needlessly exposing them to tracking.

Instead, at build time `@akashacms/plugins-external-links` discovers the destination site's favicon, downloads it, resizes it if asked, stores it in a cache directory in your project (`favicon-cache/` by default, one subdirectory per domain), and serves it from your own site under `/vendor/favicon-cache/<domain>/...`.

Instead of exposing site visitors to possible tracking, the favicon images are stored in a local, dynamically built, cache directory.  The visitors browser loads the favicon from the same server as the website content.

You can tune the icons with a handful of optional setters:

```js
config.plugin('@akashacms/plugins-external-links')
    .setFaviconCacheDir(config, "favicon-cache")  // directory name, mounted at /vendor/<name>
    .setFaviconSize(config, 32)                    // desired width in pixels
    .setFaviconConvertToPNG(config, false);        // convert JPEG/WebP/GIF sources to PNG
```

Only touch these if you have a reason: a size set triggers a resize, `convertToPNG` runs non-ICO sources through an image conversion, and the cache directory name changes where the files are served from.

## Showing a generic "external link" icon

Some sites prefer one consistent glyph for every outbound link, rather than a different favicon per destination.  That is a second, independent switch, and it can be used alongside the favicon or instead of it:

```js
config.plugin('@akashacms/plugins-external-links')
    .setShowIcon(config, "after");
```

It places a single `<img>` for every external link, using a default `/img/extlink.png`.  If you want your own glyph, point it at yours:

```js
config.plugin('@akashacms/plugins-external-links')
    .setShowIcon(config, "before")
    .setExternalLinkIcon(config, "/icons/arrow-outbound.svg");
```

Because it is a single image rather than one per site, it gives a uniform "this leaves the site" marker — visually quieter than favicons, and it cannot fail the way a missing favicon can.

## Controlling `rel="nofollow"`

This feature is about *search engines* rather than appearance, and the one most worth getting right.  By default the plugin adds no `rel` attributes at all.  You control the behavior with a single default direction plus a pair of lists.

The default direction:

```js
config.plugin('@akashacms/plugins-external-links')
    .setPreferNofollow(config, false);
```

* `setPreferNofollow(config, false)` (the default) — outbound links get **no** `rel="nofollow"` unless a site is on the *blacklist*.
* `setPreferNofollow(config, true)` — outbound links **all** get `rel="nofollow"` unless a site is on the *whitelist*.

The two lists are the fine-adjustment on top of that default:

```js
config.plugin('@akashacms/plugins-external-links')
    .setPreferNofollow(config, false)
    .addBlacklistEntry(config, /amazon.com$/)
    .addBlacklistEntry(config, /ebay.com$/)
    .addBlacklistEntry(config, /facebook.com$/);

config.plugin('@akashacms/plugins-external-links')
    .setPreferNofollow(config, true)
    .addWhitelistEntry(config, 'davidherron.com')
    .addWhitelistEntry(config, 'visforvoltage.org');
```

Entries are matched as **regular expressions against the link's host**, so a pattern like `/wikipedia\.org$/i` matches `wikipedia.org` and `en.wikipedia.org` but not a domain that merely contains those characters.  The black-and-white logic is: with nofollow-averse you blacklist the sites you want *excluded* from credit; with nofollow-by-default you whitelist the sites you want to *keep*.

Why bother at all?  Three practical reasons.  

1. Links to sites you earn revenue from — affiliate links — are expected to be nofollow, and a consistent policy keeps that clean instead of relying on remembering to add it by hand.
2. Nofollowing obviously low-quality or manipulative sites says to the crawler you are not silently passing authority to them.
3. It simply makes your editorial intent explicit: which off-site links are recommendations and which are merely references.

## Excluding a specific link

Both the favicon and the generic icon are skipped automatically for any link that already contains an `<img>` (the icon would nest inside the image and look wrong), and there is an escape hatch for the occasional link where the layout does not allow an icon at all.  Add the class `akashacms-external-links-suppress-icons` to that one link:

```html
<a href="https://example.com"
   class="akashacms-external-links-suppress-icons">Example</a>
```

That single link gets no favicon and no external-link icon, while every other link on the page behaves normally.  The `nofollow`/`target` processing is independent and still applies.

## Affiliate and tracking links

For sites that earn affiliate commissions, the plugin can also rewrite the outgoing URL to carry the tracking code automatically — an Amazon `tag=` for Amazon, a `rf=` for Zazzle, and so on — so the link is correct whether or not you remembered to add the code by hand.  It is driven by an `affiliateDomains` list you supply.  In practice most sites delegate this whole concern to the dedicated `@akashacms/plugins-affiliates` plugin instead, which is the one that ships ready-made tracking-code handling; the two are designed to coexist, and you typically use affiliates for the commission logic and external-links for the target/rel/icon behavior.

## A realistic configuration

Putting the functional areas together, a content site that wants a new-tab, self-hosted-favicon, nofollow-conscious setup looks roughly like this (this is a pared-down version of what https://techsparx.com uses):

```js
import { ExternalLinksPlugin } from '@akashacms/plugins-external-links';

config
    // ...
    .use(ExternalLinksPlugin);

config.plugin('@akashacms/plugins-external-links')
    .setTargetBlank(config, true)            // outbound links open in a new tab
    .setShowFavicons(config, "before")       // self-hosted favicon before each link
    .addBlacklistEntry(config, /amazon.com$/)
    .addBlacklistEntry(config, /ebay.com$/)
    .addBlacklistEntry(config, /facebook.com$/)
    .addBlacklistEntry(config, /snopes.com$/)
    .addBlacklistEntry(config, /wikipedia.org$/i);
```

Render a page, then open the HTML and you will see exactly what the plugin decided to emit on an outbound link:

```html
<img class="akashacms-external-links-favicon"
     src="/vendor/favicon-cache/amazon.com/favicon.ico"
     alt="(amazon.com)" />
<a href="https://www.amazon.com/dp/..."
   target="_blank"
   rel="nofollow">the relevant book</a>
```

## What to remember

* The plugin is safe to add and defaults to doing nothing; every feature is opt-in.
* Four independent areas: **new tab** (`setTargetBlank`), **favicon** (`setShowFavicons` + the favicon tuning setters), **generic icon** (`setShowIcon` + `setExternalLinkIcon`), and **nofollow policy** (`setPreferNofollow` with `blacklist`/`whitelist`).
* Favicons are discovered, downloaded, and self-hosted at build time — the reader's browser never calls a third-party service.
* Only links that point off the site are touched; your own internal links are left as you wrote them.
* Suppress either icon on a specific link with the `akashacms-external-links-suppress-icons` class.

The formal reference for every option and its defaults is in the [plugin documentation](/plugins/external-links/index.html).
