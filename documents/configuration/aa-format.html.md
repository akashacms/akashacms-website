---
layout: article.html.ejs
title: AkashaCMS configuration file format
rightsidebar:
---

Because the AkashaCMS configuration file, `config.js`, is just a module, it takes this overall form:

    module.exports = {
        root_assets: ...
        ... other data objects
    }

This object in turn contains other objects, that comprise the configuration data.  These are:

* `root_assets` - An array of directories each of which are simply copied to the output directory, without any processing.  This is meant to be used for CSS, JavaScript or image files.
* `root_layouts` - An array of directories each of which contain template files that together determine the overall page layout of the site.
* `root_partials` - An array of directories each of which contain templates that can be inserted inline anywhere using the function named `partial`.  These templates can be passed a data object that's then rendered by the template.
* `root_docs` - An array of directories each of which contain the content files, each of which correspond to a URL on the website.
* `root_out` - The output directory into which everything is rendered.
* `root_url` - Declares the destination URL of the website.  This gets used in various ways.
* `doMinimize` - Instruct AkashaCMS to minimize the output directory once built.  This is equivalent to the `akashacms minimize` command.
* `deploy_rsync` - Data required to configure `rsync` in the `akashacms deploy` command.
* `plugins` - An array of plugin names to use for this site.
* `data` - An object that is passed into the rendering of all pages.
* `funcs` - A list of functions available to the rendering of all pages.
* `config` - A function that, if present, is called while configuring AkashaCMS for this site.

The big picture operation of AkashaCMS is that it

* Renders each file in each `root_docs` directory into the `root_out` directory.
* Each of the Document files layout templates, or partial templates, to render the page
* The `data` object is available while each page is being rendered.

Because `root_assets`, `root_layouts` and `root_partials` are all arrays, AkashaCMS searches for files in each directory in the array in order.  If, among the directories listed in one array, are two files with the same name, AkashaCMS will stop searching at the first one it finds. This has important considerations for [plugins](ab-plugins.html) because you can provide your own version of a template provided by a plugin.

The files in `root_layouts` provide page layout structure.  These can chain together to allow for multiple page layouts.  See [the layout documentation](../layout/index.html) for more information.

The files in `root_partials` provide snippets of HTML rendering that can be plopped into the middle of a page anywhere.  See [the partials documentation](../layout/partials.html) for more information.

Each of the functions in the `funcs` object are available inside templates as functions.  See [the template functions documentation](../layout/template-functions.html) for more information.

The [config file for this website](https://github.com/robogeek/akashacms-website/blob/master/config.js) should be able to serve as a good example of a config file.
