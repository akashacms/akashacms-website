---
layout: article.html.ejs
title: File names and extensions in AkashaCMS 
rightsidebar:
publDate: May 26, 2014
---

AkashaCMS uses the file name extensions to determine how to process each document, layout or partial.  During the AkashaCMS v0.3.x time frame the rules for file names will be in flux.  File name rules will settle down by the time AkashaCMS v0.4 is released.

The general concept is that each document has its base name (xyzzy.html) and for documents requiring special processing (say, Markdown rendering) we append extensions to the file name documenting the processing.  For example, `xyzzy.html.ejs.md` says to process the file first with Markdown, then with EJS, then with the Mahabhuta engine.  The result is `xyzzy.html`.

The extensions recognized are for files in `root_documents` and `root_layouts` directories are:

* `php` - for PHP files - must be xyzzy.php(.other.extensions)
* `html` - for HTML files - must be xyzzy.html(.other.extensions)
* `ejs` - Process with EJS - https://github.com/visionmedia/ejs
* `md` - Process with Markdown - https://github.com/evilstreak/markdown-js/
* `kernel` - Process with Kernel - https://github.com/c9/kernel

The processing by different engines occurs in the order specified in the file name.

Asset files are normally placed in the `root_assets` directory, but you may find it convenient to place them in the `root_documents` directory, instead.  Go ahead and do so, and these files will be copied with no processing to the output directory.  

Files with the extension `.css.less` are recognized specially, and will be processed with the LESS renderer to produce a CSS file.  See http://lesscss.org

Currently files in `root_partials` directories do not get the full processing treatment we just discussed.  Instead only a single phase of processing is recognized, and the Mahabhuta engine is not run on these files.

* `xyzzy.html.ejs` - Process with EJS engine
* `xyzzy.html.md` - Process with Markdown
* `xyzzy.html.kernel` - Process with Kernel engine (asynchronous)
* `xyzzy.html` - No processing

Additionally, if a partial is requested from an EJS template, do not use a `.kernel` template.   EJS does not support asynchronous functions, whereas the Kernel engine is asynchronous.

## Mahabhuta - jQuery style processing

Earlier "the Mahabhuta engine" was mentioned without explanation.  This is an experimental method for using jQuery functions to manipulate the HTML of a website.  It lets you run jQuery DOM manipulations of the HTML, but on the server.  This is a big idea - too big for this little section of this page.

Mahabhuta processing occurs on the `xyzzy.html` step of processing the file.  It remains to be verified whether Mahabhuta works for `xyzzy.php` files.

For more information see [The Mahabhuta templating engine for AkashaCMS](mahabhuta.html)

## Old Stuff


The filename extensions recognized are:

* `.css`, `.html`, `.js`, `.png`, etc - if the file has its natural extension, it is passed through uninterpreted
* `.html.ejs` - Uses the EJS template engine - https://github.com/visionmedia/ejs
* `.php.ejs` - Produces a PHP file after processing with EJS
* `.html.kernel` - Uses the Kernel template engine, which supports asynchronous coding - https://github.com/c9/kernel
* `.html.md` - Uses the markdown format - https://github.com/evilstreak/markdown-js/
* `.css.less` - Uses the LESS renderer to produce a CSS file - http://lesscss.org

The idea with this double extension is that the trailing extension documents the template engine, producing data matching the format given by the next extension.

In other words, the extensions tell you the processing pipeline that produces the file that's dropped into `root_out`.