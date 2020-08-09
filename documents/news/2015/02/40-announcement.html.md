---
layout: blog.html.njk
title: Announcing AkashaCMS 0.4.0 - server-side jQuery, streamlined rendering, and more
publicationDate: Feb 14, 2015 12:07 PDT
blogtag: news
teaser: Nearly a year in the making, with v0.4.x AkashaCMS is greatly improved, faster, uses server-side jQuery-style DOM manipulations, and more.
---

It's been about 8-9 months since the AkashaCMS 0.3.0 release, and the platform has come a long way.  Some highlights of the work which went into this release are:

* Rewrote the rendering engine a couple times.  It became very complex, but now is very simple.
* Ejected the Kernel templating engine, which had been present only to support asynchronous code.
* Developed the [Mahabhuta engine](/mahabhuta/toc.html), that uses jQuery-like DOM manipulation, and supports asynchronous code.
* Regularized the configuration file contents.
* Developed an in-browser editor that's somewhat useful
* Changed the preview mode so it dynamically rebuilds the page if it changes - making site editing more streamlined.
* Formed a [Github organization to house AkashaCMS work](https://github.com/akashacms).
* Switched the [Markdown support](/akasharender/3-create-content.html) a couple times, settling on Markdown-it.
* Developed a [blogging plugin](/plugins/blog-podcast/index.html), which is rendering this announcement post.
* Expanded the number of [embeddable content sources](/plugins/embeddables/index.html).
* Developed an initial test suite.
* Incorporated the `log4js` logging engine.
* Switched the [metadata frontmatter](/akasharender/3-create-content.html) to YAML.

Going forward I plan to keep the website up-to-date with changes as I go, and to use the `akashacms-example` site to show  recipes of how to do things.  Because both [this site](https://github.com/akashacms/akashacms-website) and [akashacms-example](https://github.com/akashacms/akashacms-example) are available in buildable form, they serve to demonstrate how to best use AkashaCMS.

For thoughts about what will be in AkashaCMS 0.5.x see the [0.5.x issue queue](https://github.com/akashacms/akashacms/milestones/v0.5) and my [blog post from a few days ago](next-release.html).
