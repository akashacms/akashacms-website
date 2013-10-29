---
layout: article.html.ejs
title: Theming with Twitter Bootstrap
rightsidebar:
---

First, you use the `akashacms-theme-bootstrap` module as so:

    plugins: [
        ...
        'akashacms-theme-bootstrap'
    ],

This gives you the default Bootstrap look and feel.

As we noted in [DIY Theming of an AkashaCMS website](aadiy.html), you can then add your own stylesheets and JavaScript pretty easily.

[GetBootstrap](http://getbootstrap.com) is the home site for Bootstrap, and contains all the documentation you need to use Bootstrap. The framework has an extensive range of components to use on a site.  This site is built with some of them

Additionally you can generate a customized build of Bootstrap by specifying colors, fonts, and even a subset of the features needed just by your site.  If you generate a custom build you may want to use the DIY theming approach.

There are a few sites that aid in creating themes for Bootstrap:

* [WrapBootstrap](https://wrapbootstrap.com/) - is a marketplace for commercial Bootstrap themes
* [Bootswatch](http://bootswatch.com/) - Has a few free themes for Bootstrap

A yahoogle search for "theming bootstrap" shows several online tools for generating Bootstrap themes, but the ones which turn up are compatible with Bootstrap 2.3.x.  We have updated `akashacms-theme-bootstrap` to Bootstrap 3.x.