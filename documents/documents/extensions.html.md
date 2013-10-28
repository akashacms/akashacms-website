---
layout: article.html.ejs
title: File names and extensions in AkashaCMS 
rightsidebar:
---

AkashaCMS uses the file name extensions to determine how to process each document, layout or partial.

The filename extensions recognized are:

* `.css`, `.html`, `.js`, `.png`, etc - if the file has its natural extension, it is passed through uninterpreted
* `.html.ejs` - Uses the EJS template engine - https://github.com/visionmedia/ejs
* `.html.kernel` - Uses the Kernel template engine, which supports asynchronous coding - https://github.com/c9/kernel
* `.html.md` - Uses the markdown format - https://github.com/evilstreak/markdown-js/
* `.css.less` - Uses the LESS renderer to produce a CSS file - http://lesscss.org

The idea with this double extension is that the trailing extension documents the template engine, producing data matching the format given by the next extension.