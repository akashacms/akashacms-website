---
layout: article.html.ejs
title: Theme for AkashaCMS using HTML5 Boilerplate (akashacms-theme-boilerplate)
rightsidebar:
---

This allows using the [HTML5 Boilerplate framework](http://html5boilerplate.com/) as the base theme of an AkashaCMS website.

We currently incorporate Boilerplate v4.3.0.  The distribution gets lightly modified for use with AkashaCMS.  See the [akashacms-theme-boilerplate project page](https://github.com/robogeek/akashacms-theme-boilerplate) for the source, or to submit patches.

To use the theme, add `akashacms-theme-boilerplate` to the plugin list and then in your layouts set this as the layout:

    ---
    ...
    layout: h5bp_page.html.ejs
    ...
    ---

Every page using that layout will use the full HTML5 Boilerplate page.

NOTE: This theme has not been tested.  I've been using the [Twitter Bootstrap](theme-bootstrap.html) instead.