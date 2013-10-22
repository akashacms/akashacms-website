---
layout: article.html.ejs
title: Configuring AkashaCMS 
rightsidebar:
---

AkashaCMS is configured by implementing a small module (named `config.js`) that simply returns a JavaScript object.  This way the configuration can be shared between multiple tools.

Hence, the `config.js` takes this overall form:

    module.exports = {
        root_assets: ...
        ... other data objects
    }

Because `config.js` is a module, it can `require` other modules and have local functions.  The `funcs` object in the configuration object usually will require additional modules or functions.

The objects are:

* `root_assets` - An array of directories which are simply copied to the output directory, without any processing.
* `root_layouts` - A directory containing template files that together determine the overall page layout of the site.
* `root_partials` - A directory containing templates that can be inserted inline anywhere using the function named `partial`.  These templates can be passed a data object that's then rendered by the template.
* `root_docs` - A directory containing thecontent files, each of which correspond to a URL on the website.
* `root_out` - The output directory into which everything is rendered.
* `root_url` - Declares the destination URL of the website.  This gets used in various ways.
* `doMinimize` - Instruct AkashaCMS to minimize the output directory once built.  This is equivalent to the `akashacms minimize` command.
* `deploy_rsync` - Data required to configure `rsync` in the `akashacms deploy` command.
* `data` - An object that is passed into the rendering of all pages.
* `funcs` - A list of functions available to the rendering of all pages.
