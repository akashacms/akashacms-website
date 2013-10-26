---
layout: article.html.ejs
title: AkashaCMS plugins
rightsidebar:
---

AkashaCMS can be extended using a flexible plugin system.  Consult the [directory of known plugins](../plugins/index.html) to see if the one you desire has already been built.  If not, Plugins are easy to implement and can do a wide range of things including

* Provide page layouts
* Provide assets contents
* Provide partials
* Provide template functions
* Listen to, and react to, events emitted by AkashaCMS during processing

In a config file, plugins are invoked this way:

    plugins: [
        'akashacms-breadcrumbs',
        'akashacms-booknav',
        'akashacms-embeddables',
        'akashacms-social-buttons',
        'akashacms-tagged-content',
        'akashacms-theme-bootstrap'
    ],

Each entry in the array is a module reference, and inside AkashaCMS each one is require'd and then its `config` function is called.    

An AkashaCMS plugin is simply a Node.js module that has a function with this signature:

    module.exports.config = function(akasha, config) {
        ... config function
    }

The `config` function is called in the first step of processing a website.  The `akasha` object provided is the `akashacms` module, while the `config` object is the configuration file.

A common task is to add a directory to `root_assets`, `root_layouts` or `root_partials`, when the plugin wants to provide files of its own.

    module.exports.config = function(akasha, config) {
        config.root_partials.push(path.join(__dirname, 'partials'));
        config.root_layouts.push(path.join(__dirname, 'layout'));
        config.root_assets.push(path.join(__dirname, 'bootstrap'));
        ...
    }

Remember that AkashaCMS searches these arrays to find files.  This way a plugin can provide files for use within AkashaCMS.

The `push` function makes sure the directory name goes to the end of the given array.   This seemingly minor point is important for determining the order of precedence of files in one directory or another.

Consider this example of another common `config` function task, from the `akashacms-social-buttons` plugin, of adding a new template function:

    // http://www.reddit.com/buttons/
    config.funcs.redditThisButton = function(arg, callback) {
        var val = akasha.partialSync(config, "reddit-this.html.ejs", arg);
        if (callback) callback(undefined, val);
        return val;
    }

This adds a function, `redditThisButton`, to the functions available in a template.  That function then renders some data using the `reddit-this.html.ejs` partial.  An implementation of this partial is provided inside the `akashacms-social-buttons` plugin.

Plugins will commonly do this, provide a template function with a partial that's rendering some data.  Because AkashaCMS searches these arrays in order, and because it stops at the first instance of a given file name, it's possible to override a specific partial or layout template by ensuring an identically named template file appears earlier in the search order.

That is... for any website with a few plugins, the content of these array will be something like

    [ site, P1, P2, P3, P4, ... ]

That's because of using `push` to put each plugins' directory at the end of the array.

AkashaCMS, searching for a partial named `reddit-this.html.ejs` will look in these directories in order

    site/partials/reddit-this.html.ejs
    P1/partials/reddit-this.html.ejs
    P2/partials/reddit-this.html.ejs
    P3/partials/reddit-this.html.ejs
    P4/partials/reddit-this.html.ejs

Suppose both `site/reddit-this.html.ejs` and `P3/reddit-this.html.ejs` exist.  The first one on the list, `site/reddit-this.html.ejs`, will be used because AkashaCMS will find it first.

The general principle is that plugins attach their directories to the end of the list, so that the website can override the plugins' templates.

That way, directories provided by the website config file will always be listed first in these directory arrays.

# Typical plugin structure

The typical plugin will have this directory structure

    partials/*
    assets/*
    layout/*
    index.js
    package.json

The `partials` directory will of course contain partial templates.

The `assets` and `layout` directories are less typically used.  The first, of course, contains static files like images, while the second contains page layouts.

The `index.js` module will, of course, contain the `config` function and the `package.json` file is necessary to ensure it's recognized by both Node and npm as a module.

Typically the `config` function will have this structure:

    module.exports.config = function(akasha, config) {
        // Push directories onto end of the array
        config.root_partials.push(path.join(__dirname, 'partials'));
        // config.root_layouts.push(path.join(__dirname, 'layout'));
        // config.root_assets.push(path.join(__dirname, 'bootstrap'));
        ...
        config.funcs.function1 =  function(arg, callback) {
            var val = akasha.partialSync(config, "partial1.html.ejs", arg);
            if (callback) callback(undefined, val);
            return val;
        }
        config.funcs.function2 =  function(arg, callback) {
            var val = akasha.partialSync(config, "partial2.html.ejs", arg);
            if (callback) callback(undefined, val);
            return val;
        }
    }

The code sequence

        config.funcs.function2 =  function(arg, callback) {
            ...
            if (callback) callback(undefined, val);
            return val;
        }

is necessary for fitting with AkashaCMS's rendering system.  AkashaCMS supports both asynchronous and synchronous rendering, and in many cases these template functions can work in either model.

In some cases a template function is unable to operate asynchronously.  An example is this function from `akashacms-embeddables`

    config.funcs.youtubePlayer = function(arg, callback) {
        if (!callback)       { callback(new Error("No callback given")); }
        if (!arg.youtubeUrl) { callback(new Error("No youtubeUrl given")); }
        if (!arg.template)   { arg.template = "youtube-embed.html.ejs"; }
        arg.url = arg.youtubeUrl;
        akasha.oembedRender(arg, callback);
    }

This calls OEmbed, which is a network protocol that queries over the Internet to retrieve some data.  It obviously cannot be used in a synchronous execution context.  There is no attempt to synchronously return data from the function, instead it solely calls the callback function.
