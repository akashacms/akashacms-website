---
layout: article.html.ejs
title: Embeddable content plugin (akashacms-embeddables)
rightsidebar:
teaser: Support embedding stuff from 3rd parties on an AkashaCMS site.
---

This plugin is a bit of a catch-all, meant to support any service supporting embeddable content.  Currently there are two services implemented

* Google Docs Viewer - let's you embed any document from around the Internet using just a URL
* Youtube - Responsive implementation of a YouTube player
* Viewer.js Viewer - Let's you embed documents supported by Viewer.js/PDF.js

It's of course possible to support more embeddable services.  Adding to this module is as simple as a pull request on the [akashacms-embeddables project](https://github.com/robogeek/akashacms-embeddables).

# Google Docs Viewer

The template function `googleDocsViewer` generates a viewer as documented on this page:  <a href="https://docs.google.com/viewer">docs.google.com/viewer</a>.  It takes one argument, `documentUrl` and would be used this way:

    <%- googleDocsViewer({
        documentUrl: "... URL for the document ..."
    }) %>

The template function `googleDocsViewLink` generates a link to Google's website for the same viewer technology.  This is documented on the above page.  It takes two arguments, `documentUrl` and `anchorText`.  The latter is simply the text in the link.  It's used as so:

    <p>View in Google Docs: <%- googleDocsViewLink({
        documentUrl: "... URL for the document ...",
        documentAnchorText: "... text to show ..."
    }) %></p>

# YouTube viewer

This viewer uses the AkashaCMS built-in support for the oEmbed protocol to query for the embed code for YouTube videos.  It's used like so:

    <%- youtubePlayer({ youtubeUrl: "... URL for YouTube ..." }) %>

# Viewer.js

[Viewer.js](http://viewerjs.org/) is a document viewer built upon the foundation of PDF.js.  PDF.js is the document rendering engine for Mozilla, and is a PDF viewer written in pure JavaScript.  What Viewer.js does is make it trivially easy to use PDF.js, plus it adds support for a few more document types.

You can generate a link to a full screen viewer this way:

    <%- viewerJSLink({ docUrl: "... URL ...", anchorText: "Name of document" }) %>

Or you can make the viewer be rendered in-line on the page this way:

    <%- viewerJSViewer({ docUrl: "... URL ...", width: "100%", height: "900" }) %>

The URL requires a little bit of special consideration.  With a remote URL (http://some.where/path/to/file.pdf) you simply give it that URL.  For files stored on the website, it needs to be the path from the root of ```root_documents``` directory.  Internally, the code generates a relative URL from the viewer code and you can learn why in the [Viewer.js installation instructions](http://viewerjs.org/instructions/)

If you leave off ```anchorText``` it'll instead read "Click here".

If you leave off ```width``` or ```height``` it'll default to the values given above.  The 900px height assumes a reasonably large screen, and that a wordprocessor document is being viewed.  Using width of "100%" makes the Viewer fill out whatever container it's sitting in, plus it exhibits nice responsive behavior to resize itself to the screen.

Obviously you can tweak these settings depending on your needs or perception of your users needs.
