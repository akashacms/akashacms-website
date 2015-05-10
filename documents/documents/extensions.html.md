---
layout: article.html.ejs
title: File names and extensions in AkashaCMS 
rightsidebar:
publicationDate: Jan 1, 2015
author: david
---
AkashaCMS uses the file name extensions to determine how to process each document, layout or partial.  

The general concept is that each document has its base name (xyzzy.html) and for documents requiring special processing (say, Markdown rendering) we append a second extension to the file name documenting that processing.  For example, `xyzzy.html.md` says to process the file first with Markdown, then with [the Mahabhuta engine](mahabhuta.html).  The result is `xyzzy.html`.

That's a "renderChain", or a chain of processing steps for a given file extension.

The extensions recognized are for files in `root_documents` and `root_layouts` directories are:

* `php` - for PHP files - must be `xyzzy.php` or `xyzzy.php.ejs` (see [PHP files in Akashacms](php-documents.html) for instructions)
* `html` - for HTML files - must be `xyzzy.html(.other.extensions)`
* `ejs` - Process with EJS - must be either `xyzzy.html.ejs` or `xyzzy.html.ejs.md` - the latter processes first with Markdown, then with EJS - https://github.com/visionmedia/ejs
* `md` - Process with Markdown - must be `xyzzy.html.md` - https://www.npmjs.com/package/markdown-it
* `.html.json` - Format JSON data with a partial (see [](json-document.html))

The processing by different engines occurs in the order specified in the file name.

Asset files are normally placed in the `root_assets` directory, but you may find it convenient to place them in the `root_documents` directory, instead.  Files with simple file names (xyzzy.html) will be copied with no processing to the output directory.  

Files with the extension `.css.less` are recognized specially, and will be processed with the LESS renderer to produce a CSS file.  See http://lesscss.org

It's possible to register arbitrary renderChain's, [to perform any processing sequence with a given file name](rendering-chains.html).  

Currently files in `root_partials` directories do not get the full processing treatment we just discussed.  Instead only a single phase of processing is recognized, and the Mahabhuta engine is not run on these files.

* `xyzzy.html.ejs` - Process with EJS engine
* `xyzzy.html.md` - Process with Markdown
* `xyzzy.html.ejs.md` - Process first with Markdown, then with EJS
* `xyzzy.html` - No processing



## Mahabhuta - jQuery style processing

Earlier "the Mahabhuta engine" was mentioned without explanation.  This is a method for using jQuery functions to manipulate the HTML of a website.  Running jQuery DOM manipulations of the HTML, on the server and not in the web browser, is a big idea - too big for this little section of this page.

Mahabhuta processing occurs is run several times while processing the file.  It remains to be verified whether Mahabhuta works for `xyzzy.php` files.

For more information see [The Mahabhuta templating engine for AkashaCMS](mahabhuta.html)

## EJS - synchronous-only templating

The EJS engine follows the typical traditional template system where you have special markup with which to access Node.js code.  The primary limitation for EJS is that it only supports synchronous code.

During EJS processing special functions are available such that you can write

```
<%= functionName(args) %>
<%- functionName(args) %>
```

The first of course encodes everything for inclusion in HTML, while the second is instead included without encoding.  The difference is in how the two are displayed.  The first will make sure HTML markup is displayed as text containing HTML, whereas the second will display what the HTML code says to show.

Any function executed in EJS has to run synchronously.

Any functions listed in `config.funcs` are made available as are two special functions provided by AkashaCMS.

The first, `partial`, [is documented elsewhere](/layouts/partials.html).

The second, `plugin`, lets one access functions exported by plugins.

```
<%= plugin('plugin-name').functionName(args) %>
```

This looks up the plugin by name, returning the plugin at which point you can invoke any of its functions.  Of course those functions must execute synchronously.

