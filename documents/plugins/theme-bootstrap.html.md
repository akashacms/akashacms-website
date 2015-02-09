---
layout: article.html.ejs
title: Theme for AkashaCMS using Twitter Bootstrap (akashacms-theme-bootstrap)
rightsidebar:
---

This allows using the [Twitter Bootstrap framework](http://getbootstrap.com/) as the base theme of an AkashaCMS website.

We currently incorporate Bootstrap v3.0.  The distribution gets lightly modified for use with AkashaCMS.  See the [akashacms-theme-bootstrap project page](https://github.com/robogeek/akashacms-theme-bootstrap) for the source, or to submit patches.

To use the theme, add `akashacms-theme-bootstrap` to the plugin list and then in your layouts set this as the layout:

    ---
    ...
    layout: boot_page.html.ejs
    ...
    ---

Every page using that layout will use the full Bootstrap page.

Additionally, this theme provides a number of partials that override partials from other plugins.  These re-implement Bootstrapified versions of various things.