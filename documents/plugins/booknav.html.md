---
layout: article.html.ejs
title: Book-style navigation plugin  (akashacms-booknav)
rightsidebar:
---

The `akashacms-booknav` doesn't quite live up to the original goal, but it is still useful.  The goal had been to support a tree of documents, with "Next" and "Previous" links between documents to make a group of pages that act somewhat like chapters in a book.  The idea was inspired by the `book` module in Drupal.

The part of `akashacms-booknav` which works correctly generates an indented listing of all the child documents to the current document.

The list of links in the [AkashaCMS plugin directory](index.html) is generated with this module.  
Another example exists on the [GreenTransportation.info electric vehicle tracking section](http://greentransportation.info/ev-tracker/index.html).

The source for this file uses the template `index-page.html.ejs` ([source](https://github.com/robogeek/akashacms-website/blob/master/layouts/index-page.html.ejs)).

The critical line is:

      <%- bookChildTree(locals) %>

This function scans through the documents of the website, finds everything under the directory containing the current document, and generates links.

This plugin looks for `teaser` metadata in the documents, and if present adds the teaser following the link.

An alternative is available if you're using Bootstrap, that uses the Bootstrap List Group component

      <%- bookChildTreeBootstrap(locals) %>