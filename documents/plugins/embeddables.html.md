---
layout: article.html.ejs
title: Embeddable content plugin (akashacms-embeddables)
rightsidebar:
teaser: Support embedding stuff from 3rd parties on an AkashaCMS site.
---

This plugin is a bit of a catch-all, meant to support any service supporting embeddable content.  Currently there are two services implemented

* Google Docs Viewer - let's you embed any document from around the Internet using just a URL
* Youtube - Responsive implementation of a YouTube player

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

