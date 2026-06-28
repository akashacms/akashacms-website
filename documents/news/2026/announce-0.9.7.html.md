---
layout: blog.html.njk
title: Announcing AkashaCMS v0.9.7 - vast performance improvements, starting 0.10
publicationDate: June 28, 2026
blogtag: news
teaser: |
  I've solved the performance issue with Akasharender after a year of scratching my head.  Along the way many improvements were made, and the performance solution was an accident while working on something else.
heroPicture:
---

Rendering my site, `techsparx.com`, with well over 1000 pages, took 12 minutes on my 10 year old Dell laptop.  A lot of that 12 minutes can be attributed to the mSATA drive, because my similarly aged Intel NUC rendered `techsparx.com` in about 6 minutes.  Either way, the rendering time was slow.  Too slow.

Rendering time is now down to about 3 minutes.  And, on my fastest machine (a modern Ryzen 7 miniPC that runs my local AI setup), the time-to-render `techsparx.com` is about 40 seconds.  And, a just-completed experiment makes a further reduction in time-to-render by skipping rendering pages that haven't changed to where my laptop takes 50 seconds.

My main overriding goal for the 0.9 release cycle was to improve performance to the point where I could easily render `techsparx.com` on my laptop.

A reduction from 12+ minutes to 50 seconds meant I could declare 0.9 as "*finished*" and move on to the tasks lined up for 0.10.

The theme for 0.10 is improving and professionalizing every corner of the AkashaCMS ecosystem.  Stay tuned for what's in store.

# Accomplishments in 0.9

The 0.9 release train [started a year ago](/news/2025/announce-0-9.html) with a switch from LokiJS to using SQLITE3.  IIRC, LokiJS is an interesting design for an in-memory database, but there were performance issues, and the package was no longer maintained.  I bragged at the time that the time-to-render `techsparx.com` had been reduced to about 10 minutes.  Oh boy.

**Removed the real-time cache**: I removed the real-time cache structure in an effort to simplify AkashaRender.  The real time cache used Chokidar to watch the directory trees, and update the cached data whenever a file changed.  It supported the "watch mode" where we could run "*akasharender watch*" and it would automatically rebuild files that had changed.

While useful, the implementation was beyond complex, hard to maintain, and I felt introduced overhead that kept the performance slow.

**Removed SQLITE3ORM to use straight SQL** It had seemed like a good idea, a lightweight ORM wrapper around SQLITE3 to simplify writing database code.  But this also introduced complexity.

I'm convinced that, after several years of developing AkashaRender on top of SQLITE3, having a database inside AkashaRender is a good idea.  The database makes it possible to search through documents in any way allowed by an SQL database.  Further, SQLITE3 has a long history of stability and importance making it a good foundation.

But, does that mean we must introduce unneeded complexity?  SQLITE3ORM was ditched to reduce complexity, and to enable a switch to using the SQLITE3 that's baked into Node.js.

**Move some of tagged-content into AkashaRender core**  It made sense to have part of the _tags_ functionality in AkashaRender.  Tags are recognized as part of the file cache.

**Moved to Node.js 24.x**  The Node.js team made many improvements in 24.x, so it made sense to make that the base assumption, enforced in `package.json`.  So many improvements are in 26.x that we may shortly do the same.

**Added tooling to support exploring performance**  To better study AkashaRender performance, and not base it on hunches, I added instrumentation to better measure what's going on.

First was to use the Node.js performance package to make high resolution measurements for page rendering phases.

Second was adding to Mahabhuta similar high resolution measurements of the time to execute the Mahafuncs.

Using those allowed Claude AI to diagnose performance issues and make sensible recommendations.

**Switched to `node:sqlite` from `sqlite3`**  Recently, I noticed that the sqlite3 package managers had completely deprecated the package, saying that it was no longer maintained.

While the package is reliable, it also carries a lot of dead weight dependencies to many old packages that are also no longer maintained.  As a result, I'd wanted to remove this dependency, reducing the weight of an AkashaRender installation, and switch to `node:sqlite`.

**Developed `promised.node.sqlite` as part of switch to `node:sqlite`**  The older `promised.sqlite` package is a wrapper around the `sqlite3` package.  Because the `sqlite3` functions are all synchronous, it doesn't fit well with the modern Node.js environment which uses `async` functions whereever possible.  The `promised.sqlite` package makes sqlite3 an async package, sort of.

But, `promised.sqlite` doesn't support `node:sqlite`, and it seems to no longer be maintained, and its author wasn't interested in supporting `node:sqlite`.

The new `promised.node.sqlite` package is a wrapper around `node:sqlite` with the same goal of bringing promised API execution to `node:sqlite`.  AkashaRender uses `promised.node.sqlite` to access `node:sqlite`.

**Added a feature for validating the XML sitemap**  At some point I became aware that the sitemaps were broken.  Oops.  I decided it wasn't enough to fix the bug, but also necessary to validate the generated sitemap.

```
Usage: cli validate-sitemap [options] <configFN>

Validate sitemap XML file against rendered output directory

Options:
  --sitemap <filename>  Sitemap filename relative to output directory (default: "sitemap.xml")
  --strict              Exit with error code if validation fails (default: false)
  --json                Output results as JSON (default: false)
  -h, --help            display help for command
```

**Added an experimental LLM-Wiki to the akasharender source** The generated "wiki" is a way of auto-documenting akasharender and other AkashaCMS modules.  I use this to help plan new features.  While implementing the features, various documents are automatically added to the wiki, which should help future reviewers of AkashaRender to better understand what's going on.

**Added the ETA rendering engine**  I asked an AI what is the fastest template engine for Node.js.  It said - ETA.  Its templates are in the same style as EJS, and it's claimed to be a zillion times faster or something.  Maybe it will make a difference to rewrite the templates in ETA.  I haven't made that experiment yet.

**The accidental performance fix** While adding ETA to `@akashacms/renderers` -- this is the layer which handles the rendering engine support in AkashaRender -- I noticed that I'd added runtime dynamic data validation using the [runtime-data-validation](https://www.npmjs.com/package/runtime-data-validation) package I wrote four years ago.  Theoretically it's a good idea to do data validation to ensure the code is receiving correct data.

But, that feature is implemented on top of the old Typescript decorators feature that is no longer supported.  So, in an effort to clean up the code by removing a dependency on an old out of date package, I accidentally made a vast performance improvement.

This is the time-to-render `techsparx.com` with akasharender@0.9.6

```shell
# On my laptop with mSATA drive
real    12m36.269s
user    8m22.592s
sys     0m10.703s

# On a 10-year-old NUC with NVME drive
real    6m16.086s
user    6m24.845s
sys     0m7.921s
```

That's a big performance improvement just from a faster disc.

And, this is the time-to-render `techsparx.com` with akasharender@0.9.7

```shell
# On my laptop with mSATA drive
real	2m56.780s
user	2m43.681s
sys	    0m9.663s
```

What Claude explained is that every decorated function call -- the decorated functions in `@akashacms/renderers` were critical in akasharender -- ran this:

```js
descriptor.value = function (...args) {
    if (enabled) {
        let validators = Reflect.getMetadata(PARAMETER_VALIDATORS, target, propertyKey) || [];
        for (const key in Object.keys(validators)) { ... func(value); }
    }
    return savedValue.call(this, ...args);
};
```

Those two steps, `Reflect.getMetadata` and `Object.keys` are very slow, and were executed for every invocation of certain heavily used functions.

# Introducing AkashaRender 0.10

Now that AkashaRender 0.9 is declared as "finished", I've begun work on new features.

To manage this work is happening on two branches:

* The `master` branch contains the _current_ akasharender source, which is at 0.9.7 as of this writing
* The `0.10` branch contains new feature work for the 0.10 version

Some of the plugins also have 0.10 branches and are following the same model.

So far, none of the 0.10 releases are published to NPM.  If I do this, a _stable_ tag will be used on the latest 0.9.x release.

Currently the 0.10 plugins are compatible with akasharender 0.9.7.

## The themes for 0.10

* Revamp everything in akasharender and the plugins to be more complete and professional.
* Add metadata to tags to improve integration with the microformat, indieweb, and friendiverse models.
* Beef up PDF Document Maker.  Promote PDF Document Maker because it is such an excellent tool.
* Improve integration of diagrams into AkashaCMS websites.
* Reduce the external dependencies and the footprint for installing akasharender.
* Resurrect the EPUB support probably in the model of the PDF Document maker application.

## Skip rendering pages that do not need to be rendered

An author using AkashaCMS will be rerunning `akasharender render` repeatedly while editing their website.  They may be editing plugins, layout templates, or content.  Why should that author wait for a complete site rebuild if s/he only edited one document?

The simple implementation of `akasharender render` is to simply re-render every document.  On a small website one might not care about the time-to-render, but on `techsparx.com` with its 1000+ pages it's a large waste of resources to re-render everything if I've just edited one file.

The test whether to re-render a page is:

* Is the source document (`documents/path/to/file-name.html.md`) newer than the corresponding output file?
* Is the layout template for that document newer than the corresponding output file?

"Newer than" means to compare the filesystem timestamps.

It was ruled unfeasible to try and determine whether one of the partial templates used on a page is newer than the corresponding output file.

The result is that, on my creaky old laptop with mSATA drive, that used to take 12+ minutes to do a full re-render for `techsparx.com`, now re-renders a single document in 56 seconds (on my creaky old mSATA laptop):

```shell
$ touch documents/linux/routers/wifi-calling.html.md 
$ time npm run build

> techsparx.com@1.0.0 build
> akasharender render --copy-assets config.mjs  --caching-timeout 9999999 --quiet

GENERATED RSS https://techsparx.com/blog/rss.xml rssitems # 60 in 0.42601248000000486
GENERATED RSS https://techsparx.com/doctor-who/rss.xml rssitems # 60 in 0.4275879300000015
GENERATED RSS https://techsparx.com/ALL.xml rssitems # 60 in 0.42762841699999987
GENERATED RSS https://techsparx.com/nodejs/rss.xml rssitems # 60 in 0.42799697300000117

real	0m53.323s
user	0m37.130s
sys     0m6.447s
```

One can tell AkashaRender to re-render every page with the `--force-render-all` option:

```shell
$ time npx akasharender render --force-render-all --copy-assets config.mjs  --caching-timeout 9999999 --quiet

GENERATED RSS https://techsparx.com/blog/rss.xml rssitems # 60 in 0.39727961500000675
GENERATED RSS https://techsparx.com/doctor-who/rss.xml rssitems # 60 in 0.3973638129999745
GENERATED RSS https://techsparx.com/nodejs/rss.xml rssitems # 60 in 0.3974311089999974
GENERATED RSS https://techsparx.com/ALL.xml rssitems # 60 in 0.39770484800002304

real	6m22.680s
user	5m37.449s
sys     0m11.462s
```

## Rewrite `@akashacms/plugins-tagged-content` for complete functionality, and adding microformat tag metadata

The tagged-content always felt like an incomplete thing that wasn't well implemented.

It has been beefed up with more complete functionality.  One potentially important thing is to include microformat metadata in the generated tags.

I plan to add microformat metadata across an AkashaCMS website, as well as support for Friendiverse markup.

## Added an oEmbed provider to `@akashacms/plugins-base`

The oEmbed protocol allows one website to automatically generate a nice preview of some content identified by a URL.

This should mean automatically allowing 3rd party websites to better present links to a page on a site generated by AkashaCMS.

The implementation creates a JSON file next to each rendered HTML page.  That JSON contains the oEmbed data, and is generated while rendering a website.

