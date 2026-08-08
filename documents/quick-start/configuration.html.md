---
layout: getting-started.html.njk
title: Project configuration
rightsidebar:
author: david
publicationDate: August 5, 2026
step: 2
---

The Configuration object, exported from `akasharender`, configures an AkashaCMS project.  It holds data about the setup of the project, and is used throughout all AkashaCMS components.

It is a normal TypeScript object, and is tyupically created in a Node.js module file named `config.mjs`.  The `.mjs` extension is used because it is now simplest to use AkashaCMS projects as ES6-style modules.  We then call methods on this instance to set up its configuration.

What's required is an instance of the Configuration class.  It is not required to use a file named `config.mjs`, for example the `akasharender` test suite contains examples of Configuration objects created in-line with a test suite file.   You may have multiple configuration objects for the same project.

Here's a simple configuration file:

```js
import path from 'node:path';
import util from 'node:util';
import akasha from 'akasharender';

const config = new akasha.Configuration();

config.rootURL("http://example.com");

const __dirname = import.meta.dirname;
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
// Add this to the top of config.mjs
import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';
import { BreadcrumbsPlugin } from '@akashacms/plugins-breadcrumbs';
import { BooknavPlugin } from '@akashacms/plugins-booknav';
import { TaggedContentPlugin } from '@akashacms/plugins-tagged-content';

// Add this in the middle section of config.mjs
config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin), {
        generateSitemapFlag: true
    })
    .use(BreadcrumbsPlugin)
    .use(BooknavPlugin)
    .use(TaggedContentPlugin, {
        sortBy: 'title',
        // @tagDescription@ can only appear once
        headerTemplate: "---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p><a href='./index.html'>Tag Index</a></p><p>Pages with tag @tagName@</p><p>@tagDescription@</p>",
        indexTemplate: "---\ntitle: Tags for AkashaCMS Example site\nlayout: tagpage.html.ejs\n---\n",
        pathIndexes: '/tags/'
    });
```

The `.use` function says to add a plugin to the AkashaRender configuration.  We pass in the module, and an optional configuration object.

Because of what `@akashacms/theme-bootstrap` does, it has to be listed first.  Namely, it overrides templates supplied by other plugins with equivalent templates which use Bootstrap features.  Overriding a template in another plugin means that the template directories in `@akashacms/theme-bootstrap` must be listed first so that it's templates are found first.

What does that mean?  The `layouts` and `partials` directories contain templates we use for formatting things on the resulting website.  AkashaCMS configuration includes a list of directories for four categories:  `assets`, `partials`, `layouts`, and `documents`.  The templates are in `partials` and `layouts` directories.  These directories are listed in order.  Effectively, a template has a file name, and will override any template with the same file name appearing in a directory later in the list.

By adding `@akashacms/theme-bootstrap` first, its template directories appear before the directories of other plugins.

The `@akashacms/plugins-base` plugin provides basic website oriented facilities.  One feature is it handles generating an XML Sitemap.

The `@akashacms/plugins-breadcrumbs` plugin helps with navigation by providing a breadcrumb trail that's suitable for somewhere towards the top of the page.  This way the user can navigate the website hierarchy.

The `@akashacms/plugins-booknav` plugin also helps with navigation, by rendering an index of pages in and below the current directory.  This is typically used in an `index.html` file so that it acts as an index of a subsection of the site.

The `@akashacms/plugins-tagged-content` plugin lets you add taxonomical categorization to pages on a site.  In other words, you can add _tags_ to content.  It also automates generating pages listing links to content having a specific tag.  The configuration object describes how those tag index pages are to be generated.

# Handling CSS and JavaScript for Bootstrap

The `@akashacms/theme-bootstrap` plugin is implemented for Bootstrap v5.  The Bootstrap documentation suggests this structure for a page to use Bootstrap.

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
    <script src=".../dist/umd/popper.min.js"></script>
    <script src=".../dist/js/bootstrap.min.js"></script>
  </body>
</html>
```

The `...` portion of these URLs should be the path to where these files are stored.  Bootstrap recommends using their CDN.  However, my belief is that it's better to put these files alongside the rest of the files of your website, so that your website has as few external dependencies as possible.

You can use npm to install the packages for `bootstrap`, and `@popperjs/core`.

But, using `@akashacms/theme-bootstrap` has the correct dependencies for those packages, and adds the directories containing the CSS and JS files to the configuration.

The result is that the tags, `<ak-stylesheets>`, `<ak-headerJavaScript>`, and `<ak-footerJavaScript>`, do the right thing.  The CSS and JS files will automatically appear at the correct place in the layout template:

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


