---
layout: blog.html.njk
title: AkashaEPUB 0.4.2 released, Guidebook written
publicationDate: April 20, 2015
blogtag: news
teaser: Since the last news in February, I had the crazy idea to repurpose AkashaCMS to support building EPUB's.  That's now finished, and a guidebook has been written.
---

One day in February I woke up with an idea to build EPUB files using AkashaCMS, and use that to construct the books I want to write.  I didn't know anything about EPUB other than the vague idea that it's a bundle of HTML files.  However, within 5 days I had read enough of the EPUB specifications, looked through enough sample EPUB's, and written enough code, to know how to generate EPUB's and had managed to generate a couple sample EPUB's.

This is a testament to AkashaCMS's flexibility that it could be so quickly adapted to a task that's so different from generating a website.

The selling points for AkashaEPUB are that it's a fairly simple way to build an electronic book using programmer-friendly tools.  This is just like how AkashaCMS makes it easy to build a website using a regular programmers editor, AkashaEPUB lets one write a book in a regular programmers editor.

An AkashaEPUB book is an AkashaCMS workspace with a few small tweaks.  The biggest being the akashacms-epub plugin, which does all the heavy lifting of building the EPUB.  The other is that AkashaEPUB builds must be done with `grunt` and not with the `akashacms` command-line tool.

There are two complete EPUB workspaces for AkashaEPUB currently:

* https://github.com/akashacms/epub-guide -- is a guidebook on using AkashaEPUB
* https://github.com/akashacms/epub-skeleton -- is a skeleton EPUB meant to be your starting point for building an EPUB
