---
layout: blog.html.liquid
title: Added support for Nunjucks templates to AkashaCMS
publicationDate: August 9, 2020
blogtag: news
teaser: |
    Following yesterdays project, today I implemented support for Nunjucks in AkashaCMS.  I also took it a step further and ensured we can use Nunjucks for implementing Partials, and used it to implement some of the core Partials.  Nunjucks is a project of the Mozilla foundation, and is a port of the Jinja2 template engine from Python to JavaScript.  It has many powerful features, while promising to be very small and fast.
---

The Nunjucks module is documented at:  https://mozilla.github.io/nunjucks/

There is an extensive set of features in this template engine, making it more interesting for AkashaCMS than EJS.

Since it appears the standard file extension for Nunjucks is `.njk`, files (documents, layouts, and partials) using Nunjucks must be named `example.html.njk`.  I have tested these three modes:

* Document file named `example.html.njk` -- since this is not processed with Markdown, the content body must be written with HTML.
* Layout template named `example.html.njs`
* Partials named `example.html.njk`

