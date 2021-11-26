---
layout: getting-started.html.njk
title: Project configuration
rightsidebar:
author: david
publicationDate: November 21, 2021
---

To configure an AkashaCMS project, we need a Configuration object.  The Configuration class is exported from AkashaRender.  What we do is create an instance of this object, and use it when making calls into AkashaRender functions.

The typical way to create this object is by creating a Node.js module file, named `config.js`, in which we create a Configuration object instance.  We then call methods on this instance to set up its configuration.

The file name is not required to be `config.js`, since it can be any file name you like.  You may have multiple configuration files for the same project directory.

Here's a simple configuration file:

```js
const akasha  = require('akasharender');

const config = new akasha.Configuration();

config.rootURL("http://example.com");

config.configDir = __dirname;

config
    .addAssetsDir('assets')
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addPartialsDir('partials');

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

config.prepare();

module.exports = config;
```

This starts by loading the `akasharender` package, and then we create a new instance of the `Configuration` class.  At the bottom we call `config.prepare`, a method that fills in any missing data and otherwise prepares the Configuration object for use.  The last line exports the `config` object via `module.exports`, so that the AkashaCMS code can access the object.

The `rootURL` function tells AkashaCMS the base URL for the website that will be generated.  It uses this value where appropriate.

The `configDir` value tells AkashaCMS the directory where the project lives.  This allows the system to compute file paths relative to the project directory.

Calling the `addAssetsDir` and other functions are not technically required.  The `prepare` method will look for those exact directory names, and if they haven't been added already, and they do exist, they will be added to the configuration.

The `setMahabhutaConfig` function is where we customize Mahabhuta.  The settings here are actually for the Cheerio library which is how Mahabhuta provides its jQuery-like API.

# Adding AkashaCMS plugins to a configuration

AkashaRender is the rendering module for AkashaCMS.  AkashaCMS is a loosely defined thing which is AkashaRender plus Mahabhuta plus the various plugins.

The plugins are what we install in addition to AkashaRender to provide additional features.  The configuration above gives us basic rendering capabilities, but there are many things we want to have in a fully-featured website.  There is a [list of known AkashaCMS plugins](/plugins/index.html) on the website.

Generally, plugins provide custom tags and custom `partials` templates we can use in the website.

When [setting up the project directory](installation.html), we installed `@akashacms/plugins-base`, `@akashacms/plugins-booknav`, `@akashacms/plugins-breadcrumbs`, `@akashacms/plugins-tagged-content`, and `@akashacms/theme-bootstrap`.  These provide some useful basic features.  But, we must add them to the configuration file so AkashaRender recognizes the plugins are available.

In `config.js` add this:

```js
config
    .use(require('@akashacms/theme-bootstrap'))
    .use(require('@akashacms/plugins-base'), {
        generateSitemapFlag: true
    })
    .use(require('@akashacms/plugins-breadcrumbs'))
    .use(require('@akashacms/plugins-booknav'))
    .use(require('@akashacms/plugins-tagged-content'), {
        sortBy: 'title',
        // @tagDescription@ can only appear once
        headerTemplate: "---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p><a href='./index.html'>Tag Index</a></p><p>Pages with tag @tagName@</p><p>@tagDescription@</p>",
        indexTemplate: "---\ntitle: Tags for AkashaCMS Example site\nlayout: tagpage.html.ejs\n---\n",
        pathIndexes: '/tags/'
    });
```

The `.use` function says to add a plugin to the AkashaRender configuration.  We pass in the module, and an optional configuration object.

Because of what `theme-bootstrap` does, it has to be listed first.  Namely, it overrides templates supplied by other plugins with equivalent templates which use Bootstrap features.

What does that mean?  The `layouts` and `partials` directories contain templates we use for formatting things on the resulting website.  AkashaRender supports there being multiple directories of each kind.  Practically speaking, every plugin supplies a set of `partials` templates which the plugin uses in formatting the things it provides.

In other words, there are six `partials` directories shown in this configuration file.  One is for the website project, and the other five are associated with these plugins.  There is another plugin, the `built-in` plugin, that is part of AkashaRender, and it also supplies a `partials` directory.

When AkashaRender is asked to render a partial template, it looks in these `partials` directories, using the first template it finds.  So, when we say `theme-bootstrap` overrides other templates, what we mean is its `partials` directory has template files with the same file name as in other plugins.  These overriding templates perform the same purpose, but use Bootstrap components.

The `@akashacms/plugins-base` plugin provides basic website oriented facilities.  One feature is it handles generating an XML Sitemap.

The `@akashacms/plugins-breadcrumbs` plugin helps with navigation by providing a breadcrumb trail that's suitable for somewhere towards the top of the page.  This way the user can navigate the website hierarchy.

The `@akashacms/plugins-booknav` plugin also helps with navigation, by rendering an index of pages in and below the current directory.  This is typically used in an `index.html` file so that it acts as an index of a subsection of the site.

The `@akashacms/plugins-tagged-content` plugin lets you add taxonomical categorization to pages on a site.  In other words, you can add _tags_ to content.  It also automates generating pages listing links to content having a specific tag.  The configuration object describes how those tag index pages are to be generated.

# Handling CSS and JavaScript for Bootstrap

The `theme-bootstrap` plugin is implemented for Bootstrap v4.  Yes, v5 is the current version, but there hasn't been time to update this plugin.  For v4, the recommended structure for loading the required JavaScript and CSS files is this:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href=".../dist/css/bootstrap.min.css" />

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- page content -->

    <!-- Load the JavaScript code at the bottom of the body -->
    <script src=".../dist/jquery.slim.min.js"></script>
    <script src=".../dist/umd/popper.min.js"></script>
    <script src=".../dist/js/bootstrap.min.js"></script>
  </body>
</html>
```

The actual recommendation is loading these files from a CDN.  However, my belief is that it's better to put these files alongside the rest of the files of your website, so that your website has as few external dependencies as possible.

The first step of implementing this came [when initializing the project directory](initialization.html), when we installed `bootstrap@4.6.x`, `popper.js@1.16.x`, and `jquery@3.6.x`.  These packages are required for running Bootstrap v4.

The next step is to ensure the files are copied into the rendering directory.  This means declaring some Asset directories.  In `config.js` add these lines:

```js
config
    ...
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    })
    .addAssetsDir({
        src: 'node_modules/popper.js/dist',
        dest: 'vendor/popper.js'
    })
    ...
```

If you look at the installed Bootstrap, Popper and jQuery packages, you find the browser-side code is in the three directories named here.  With these declarations we "_mount_" those `dist` directories into the directories named in the `dest` fields.

The next step is to configure the layout templates to include the necessary code.  The `built-in` plugin supplies a set of custom tags to assist inserting JavaScript in either the header and/or footer, and to insert CSS in the header.  Using these tags, the above HTML looks like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <ak-stylesheets></ak-stylesheets>
    <ak-headerJavaScript></ak-headerJavaScript>

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- page content -->

    <ak-footerJavaScript></ak-footerJavaScript>
  </body>
</html>
```

With appropriate data in `config.js`, this will automagically become the correct CSS and JavaScript references.

Namely, in `config.js` add this:

```js
config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/popper.js/umd/popper.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
    // Support any custom CSS files
    .addStylesheet({ href: "/style.css" })
    ...
```

The `addFooterJavaScript` function emits the JavaScript references in place of the `<ak-footerJavaScript>` tag.  There is a `addHeaderJavaScript` function that does the same for `<ak-headerJavaScript>`.  Likewise, the `addStylesheet` function emits CSS references in place of the `<ak-stylesheets>` tag.


