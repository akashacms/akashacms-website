---
layout: article.html.ejs
title: In-browser editing and preview of AkashaCMS documents
rightsidebar:
publicationDate: Feb 9, 2015
---

AkashaCMS was originally designed with the idea that the website author would edit site content using editors like Komodo or UltraEdit.  Hence, the documents are easily edited plain text files, and the structure in the file system is easy to manipulate and understand.  But for some people this is a technical hurdle, and it would be better to support in-browser editing of AkashaCMS website content.

With that in mind, AkashaCMS starting in v0.3.x had an in-browser editor and had greatly improved the site preview function.

There are two command line options, one to start the editor, the other for the site preview.

    akashacms serve

Starts the editor on port 8080 (http://localhost:8080) and the previewer on port 6080 (http://localhost:6080)

    akashacms perview

Starts only the preview mode on port 6080.

The editor is somewhat useful and somewhat straightforward.  However, I'm probably going to rewrite it.

The preview mode is much improved over the previous preview mode, which only displayed built content from the `root_out` directory.  The new preview mode now detects when a file needs to be rebuilt, and does so (the equivalent of the `akashacms render` command) on the fly.

With the new preview mode you can be editing in a regular text editor, save your work, then switch to the browser, click the reload button, and presto see your new page.