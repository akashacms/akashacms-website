---
layout: layoutarticle.html.ejs
title: Recommended layout usage in AkashaCMS
---

Create a file `page.html.ejs` to hold the HTML boilerplate, CSS references, JavaScript files, etc.  The `body` tag will be mostly empty, primarily containing

    <%- content %>

For the [AkashaCMS example](https://github.com/robogeek/akashacms-example) we started with the HTML5 Boilerplate and added the Columnal grid system.

Create one or more files to hold the overall layout of the page.

Create one or more files to hold layouts for specific page types.

The content pages should reference the layout for the specific page type.
