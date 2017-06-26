---
layout: blog.html.ejs
title: Added akashacms-footnotes plugin - EPUB's can get footnotes
publicationDate: June 7, 2015
blogtag: news
teaser: In the book I'm writing now, I want footnotes.  Therefore repurposing existing code was the order of the day.
---

The `footnote` tag has been useful for writing website content.  Now that I'm writing electronic books using AkashaEPUB, I want to use this tag, as well, to reference documents on the web.  

The `footnote` tag had been implemented inside the `akashacms-base` plugin, but that plugin is completely unsuitable for use with AkashaEPUB.  The tags provided by `akashacms-base` make too many assumptions that the goal is to generate a website.  In other words, it does things which would break an EPUB.  But the `footnote` tag by itself is pretty benign and wouldn't break an EPUB.

To that end I created a standalone plugin -- `akashacms-footnotes` and the `footnote` tag is no longer supplied by `akashacms-base`

This means for any websites using the `footnote` tag you must register `akashacms-footnotes` in your site configuration.

For more information see [](/plugins/footnotes/index.html)
