---
layout: article.html.ejs
title: AkashaCMS' builtin plugin - functionality for every use
rightsidebar:
---

The `builtin` plugin is, as the name, built-in to AkashaCMS itself and is available for everything one can do with AkashaCMS.  A plugin by this name was first implemented in AkashaCMS 0.3.x, but it contained too many functions some of which were incompatible with [AkashaEPUB](epub.html).  During the AkashaEPUB development the old builtin plugin became `akashacms-base` but after some pondering, some of the functionality in that plugin is universal and desired to always be present irregardless of what we use AkashaCMS to build.

    <ak-stylesheets></ak-stylesheets>

Generates links to CSS stylesheets, as declared in the site config file.

    <ak-headerJavaScript></ak-headerJavaScript>
    <ak-footerJavaScript></ak-footerJavaScript>

Generates JavaScript `<script>` tags either in the head of the document, or foot of the document.

    <ak-teaser></ak-teaser>

Inserts content from the `teaser` metadata variable.  The `ak_teaser.html.ejs` partial is used.

