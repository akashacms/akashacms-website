---
layout: article.html.ejs
title: File names and extensions in AkashaCMS 
rightsidebar:
publicationDate: Jan 1, 2015
author: david
---
AkashaCMS uses the file name extensions to determine how to process each document, layout or partial.  

The general concept is that each document has its base name (xyzzy.html) and for documents requiring special processing (say, Markdown rendering) we append a second extension to the file name documenting that processing.  For example, `xyzzy.html.md` says to process the file first with Markdown, then with [the Mahabhuta engine](mahabhuta.html).  The result is `xyzzy.html`.

The extensions recognized are for files in `root_documents` and `root_layouts` directories are:

* `php` - for PHP files - must be `xyzzy.php(.other.extensions)`
* `html` - for HTML files - must be `xyzzy.html(.other.extensions)`
* `ejs` - Process with EJS - must be either `xyzzy.html.ejs` or `xyzzy.html.ejs.md` - the latter processes first with Markdown, then with EJS - https://github.com/visionmedia/ejs
* `md` - Process with Markdown - must be `xyzzy.html.md` - https://www.npmjs.com/package/remarkable - https://github.com/jonschlinkert/remarkable

The processing by different engines occurs in the order specified in the file name.

Asset files are normally placed in the `root_assets` directory, but you may find it convenient to place them in the `root_documents` directory, instead.  Files with simple file names (xyzzy.html) will be copied with no processing to the output directory.  

Files with the extension `.css.less` are recognized specially, and will be processed with the LESS renderer to produce a CSS file.  See http://lesscss.org

Currently files in `root_partials` directories do not get the full processing treatment we just discussed.  Instead only a single phase of processing is recognized, and the Mahabhuta engine is not run on these files.

* `xyzzy.html.ejs` - Process with EJS engine
* `xyzzy.html.md` - Process with Markdown
* `xyzzy.html.ejs.md` - Process first with Markdown, then with EJS
* `xyzzy.html` - No processing

## Mahabhuta - jQuery style processing

Earlier "the Mahabhuta engine" was mentioned without explanation.  This is a method for using jQuery functions to manipulate the HTML of a website.  Running jQuery DOM manipulations of the HTML, on the server and not in the web browser, is a big idea - too big for this little section of this page.

Mahabhuta processing occurs is run several times while processing the file.  It remains to be verified whether Mahabhuta works for `xyzzy.php` files.

For more information see [The Mahabhuta templating engine for AkashaCMS](mahabhuta.html)