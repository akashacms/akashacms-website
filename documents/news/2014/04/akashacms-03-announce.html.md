---
layout: blog.html.ejs
title: AkashaCMS v0.3.0 released - major rearchitecting, plugins, improvements, much more planned for v0.4.x
publicationDate: 2014-04-15 00:44
blogtag: news
teaser: |
    I'm pleased to announce that AkashaCMS has reached version 0.3.0.  This version has been over a year in development and isn't quite what I'd intended, but it is a result of the actual needs during the past year.  The primary change was to architect AkashaCMS to support plugins, a move which allowed the creation of several useful plugins.
---

AkashaCMS is a "content management system", written in Node.js, for producing static HTML websites.  The goal is that AkashaCMS websites be built with modern HTML5, CSS3 and JavaScript technologies, while having the performance advantages of straight HTML files.  For some thoughts on why one should use AkashaCMS (or other static HTML CMS's) see: Static HTML website builders (AkashaCMS, etc) slashes web hosting costs to the bone

# Plugins - Extensibility for AkashaCMS

What's an AkashaCMS plugin?  The website lists the current set of plugins (link is external).  There's no central registry of plugins, but I urge anyone who's built a general purpose plugin to send documentation to put on the website.

A website declares the plugins it uses in config.js like so:

```
plugins: [
    require('akashacms-breadcrumbs'),
    require('akashacms-booknav'),
    require('akashacms-embeddables'),
    require('akashacms-social-buttons'),
    require('akashacms-tagged-content'),
    require('akashacms-theme-bootstrap'),
    require('akashacms-theme-boilerplate')
],
```

An AkashaCMS plugin is simply a module that export a function with this signature:

```
module.exports.config = function(akasha, config) { .. }
```

This function is called during AkashaCMS initialization, and the `config` function will typically manipulate the array's in `config.js`.   Typical plugins provide `assets`, `layouts`, `partials`, or `functions`.  The location of any files provided by a plugin are what gets pushed into the configuration.

There's a number of facets to this, such as allowing a website to override features provided by a plugin.  For example, a plugin could provide a template in `layout/youtube.html.ejs`, and a website could implement the same file name, and AkashaCMS would use the website's version of the template rather than the plugin's template.

AkashaCMS has a plugin named `builtin` that is invisibly included which provides a bunch of useful functions and templates, a lot of which have to do with page metadata.  It also provides a base page template adapted from the boilerplate framework.

# PHP?  Wait, I thought this was for Static HTML websites!

Another major improvement is one I snuck in a couple weeks ago.  You can now create PHP files using AkashaCMS's template processing system.   The result is that, just as we do with HTML files today in AkashaCMS, you write the PHP for the core part of the page and then wrap that with page layout templates.

You could always have created a file named `foobar.php`, either in the documents or assets directory, and AkashaCMS would copy that directly to the rendered website.   Now you can write a file name like `index.php.ejs`, and the file will be processed using EJS and output as `index.php`.  At the moment only EJS is supported with PHP files, not Kernel.

Yeah, AkashaCMS was envisioned as creating static HTML websites, and now it supports creating PHP files.  This is a little divergence from the original intentionality.  I don't know if this is going to completely destroy AkashaCMS's purity.  The feature arose directly from my needs in that I ported one of my sites, https://thereikipage.com, and it had a few PHP scripts.  Those scripts had to use the same theming as the rest of the site, and it seemed best to process the scripts through the same template files used for the site.

The result turned out very well, and it naturally fits with AkashaCMS.  You simply write a snippet of PHP code, and put an AkashaCMS `frontmatter` block that declares a `layout` file, and voila your script automatically inherits the layout/theme of the website, and voila partials are available, etc.

# What's planned for AkashaCMS 0.4.x?

As I proved with 0.3.x my intentions at the beginning are unlikely to be an accurate prediction of what 0.4.x will look like.  I've already entered a large number of issues for the v0.4.x milestone (link is external), that reflect the ideas in my mind that are needed.

Major areas are:

**Filters**: Generally, this is about manipulating the HTML before rendering is finished.  I want to do things like automatically add `rel=nofollow` to certain outbound links, or append a little "external link" icon next to outbound links.  There's potentially a huge number of filters that could be written.

Implementation will be that the rendering pipeline will send messages where a plugin function would receive the rendered HTML, and respond with manipulated HTML.

**YAML**: I need to research this better, but I understand that YAML is a data markup doohickey similar in purpose to the `frontmatter` AkashaCMS uses today, but more comprehensive.  There's times it feels the `frontmatter` format is too limiting.  For example, the `akashacms-tagged-content` plugin is an initial stab at vocabularies and tags, and it'd be very useful to have a better way of declaring a list of tag names than a simplistic comma-separated list.

**Merge/Minify JS/CSS**:  This is important for improving site speed, by reducing the number of individual file requests and reducing the size of JS/CSS assets.  There's some complexity, for example the set of JS/CSS files are not necessarily the same across the whole site.  Therefore, potentially each page has its own aggregated/minified JS/CSS file.  I might, again, punt on doing this.

**RSS/Blog/Podcast**: Theoretically AkashaCMS could build a blog or podcast website.  I have in mind some kind of method of declaring a group of content files that are to be considered as the group of files in a blog, and an RSS (or Atom) file would be generated from that group of files, as would a river-of-news index page.

I'd like AkashaCMS to support multiple "blog" clusters per website - for example, to support both a blog and a podcast on the same site.

**Rebuild only what's needed**: Currently AkashaCMS deletes everything in the output directory, then renders the entire site.  It's a simple way to ensure the site is clean every time and is exactly what the site is supposed to have.  While useful, it's wasteful to rebuild everything.  If you edit one file and want to test the change, why wait to rebuild the entire site?  AkashaCMS can build an individual file, but the feature is imperfect and what if you have several files to rebuild?
