---
layout: article.html.ejs
title: Book-style navigation plugin  (akashacms-booknav)
rightsidebar:
publicationDate: May 5, 2014
---
The `akashacms-booknav` doesn't quite live up to the original goal, but it is still useful.  The goal had been to support a tree of documents, with "Next" and "Previous" links between documents to make a group of pages that act somewhat like chapters in a book.  The idea was inspired by the `book` module in Drupal.

The part of `akashacms-booknav` which works correctly generates an indented listing of all the child documents to the current document.

The list of links in the [AkashaCMS plugin directory](index.html) is generated with this module.  
Another example exists on the [GreenTransportation.info electric vehicle politics section](http://greentransportation.info/ev-politics/index.html).

The source for this file uses the template `index-page.html.ejs` ([source](https://github.com/robogeek/akashacms-website/blob/master/layouts/index-page.html.ejs)).

The critical line is:

      <book-child-tree></book-child-tree>

This function scans through the documents of the website, finding everything under the directory containing the current document, and generating links to the pages.  The presentation is nested and indented to indicate the structure of the directory tree.

It's a quick and easy way to generate navigational pages for a group of documents.

The document metadata consulted is:

* ```title```: The title for the document.
* ```teaser```: The teaser (a short description) for the document.
* ```teaserthumb```: Path for a thumbnail image for the document.
* ```youtubeThumbnail```: URL of a YouTube video to use for thumbnail image.
* ```imageThumbnail```: URL of a video to use for thumbnail image.
