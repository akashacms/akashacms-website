---
layout: article.html.ejs
title: AkashaCMS plugins
rightsidebar:
publDate: May 5, 2014
---

AkashaCMS can be extended using a flexible plugin system.  Consult the [directory of known plugins](../plugins/index.html) to see if the one you desire has already been built.  If not, Plugins are easy to implement and can do a wide range of things including

* Provide page layouts
* Provide assets contents
* Provide partials
* Provide template functions
* Listen to, and react to, events emitted by AkashaCMS during processing

In a config file, plugins are invoked this way:

    plugins: [
        require('akashacms-theme-bootstrap'),
        require('akashacms-breadcrumbs'),
        require('akashacms-booknav'),
        require('akashacms-embeddables'),
        require('akashacms-social-buttons'),
        require('akashacms-tagged-content')
    ],

Each entry in the array is a module reference, which is require'd inside the config file.  This way the module is resolved relative to the config file.  If desired the module reference can be a string instead, but in that case it is AkashaCMS which require's the module, and the module location is resolved relative to where AkashaCMS is installed.

A plugin can override behavior (functions) or templates (layouts, or partials) defined by a plugin farther down the list.  In this plugin config, we've placed `akashacms-theme-bootstrap` because some of its partials override partials defined in other plugins.  Those partials have bootstrap-specific markup and should make a site look better.

The general rule is a plugin overrides things defined in plugins further down this list.  We'll see in a minute how this is done.

An AkashaCMS plugin is simply a Node.js module that has a function with this signature:

    module.exports.config = function(akasha, config) {
        ... config function
    }

The `config` function is called while initializing AkashaCMS.  The `akasha` object provided is the `akashacms` module, while the `config` object is the configuration file.

A common task is to add a directory to `root_assets`, `root_layouts` or `root_partials`, when the plugin wants to provide files of its own.

    module.exports.config = function(akasha, config) {
        config.root_partials.push(path.join(__dirname, 'partials'));
        config.root_layouts.push(path.join(__dirname, 'layout'));
        config.root_assets.unshift(path.join(__dirname, 'bootstrap'));
        ...
    }

Remember that AkashaCMS searches these arrays to find files.  By adding its own directories to these arrays, a plugin provides its own files for use in rendering a website.

There's a careful dance played in whether a directory is pushed or unshifted into an array.  Remember that the goal is for a plugin that's early in the list to override plugins later in the list.  Remember that `push` inserts items on the end of the array, while `unshift` inserts items at the beginning.  This seemingly minor point is important for maintaining the correct idea of which plugin is first.

What's different is that

* for `root_partials` and `root_layouts`, AkashaCMS searches for the first matching file, stopping when it finds one.  For a layout or partial template in one plugin to override one in another plugin, the plugin has to be scanned first.
* for `root_assets`, AkashaCMS copies the file tree of each named directory in turn.  For a file in a plugin asset directory to override an identically-named file in another plugin, the plugin's assets directory has to be copied second.

If you're unclear about the order of entries in these arrays, this command prints out the configuration data:

    $ akashacms config

Another common thing to do in the `config` function is to add a function for use in templates.  Remember that `config.funcs` contains the functions for use in templates.  This example comes from the `akashacms-social-buttons` plugin:

    // http://www.reddit.com/buttons/
    config.funcs.redditThisButton = function(arg, callback) {
        var val = akasha.partialSync(config, "reddit-this.html.ejs", arg);
        if (callback) callback(undefined, val);
        return val;
    }

This adds a function, `redditThisButton`, to the functions available in a template.  That function then renders some data using the `reddit-this.html.ejs` partial.  An implementation of this partial is provided inside the `akashacms-social-buttons` plugin.

Plugin functions commonly use a partial to render the data.  If you want to render the data differently than it's done by the plugin, simply override the partial file.  The akashacms-theme-bootstrap plugin does this for bootstrap-friendly site behavior.

That is... for any website with a few plugins, the content of the `root_partials` and `root_layouts` arrays will be something like

    [ site, P1, P2, P3, P4, ... ]

AkashaCMS, searching for a partial named `reddit-this.html.ejs` will look in these directories in order

    site/partials/reddit-this.html.ejs
    P1/partials/reddit-this.html.ejs
    P2/partials/reddit-this.html.ejs
    P3/partials/reddit-this.html.ejs
    P4/partials/reddit-this.html.ejs

Suppose both `site/partials/reddit-this.html.ejs` and `P3/partials/reddit-this.html.ejs` exist.  The first one on the list, `site/partials/reddit-this.html.ejs`, will be used because AkashaCMS will find it first.

# Typical plugin structure

The typical plugin will have this directory structure

    partials/*
    assets/*
    layout/*
    index.js
    package.json

The `partials` directory will of course contain partial templates.

The `assets` and `layout` directories are less typically used.  The first, of course, contains static files like images, while the second contains page layouts.

The `index.js` module will, of course, contain the `config` function and the `package.json` file is necessary to be recognized by both Node and npm as a module.

Typically the `config` function will have this structure:

    module.exports.config = function(akasha, config) {
        // Push directories onto end of the array
        config.root_partials.push(path.join(__dirname, 'partials'));
        // config.root_layouts.push(path.join(__dirname, 'layout'));
        // config.root_assets.unshift(path.join(__dirname, 'bootstrap'));
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

In some cases a template function can only operate asynchronously.  An example is this function from `akashacms-embeddables`

    config.funcs.youtubePlayer = function(arg, callback) {
        if (!callback)       { callback(new Error("No callback given")); }
        if (!arg.youtubeUrl) { callback(new Error("No youtubeUrl given")); }
        if (!arg.template)   { arg.template = "youtube-embed.html.ejs"; }
        arg.url = arg.youtubeUrl;
        akasha.oembedRender(arg, callback);
    }

This calls OEmbed, which is a network protocol that queries over the Internet to retrieve some data.  It obviously cannot be used in a synchronous execution context.  There is no attempt to synchronously return data from the function, instead it solely calls the callback function.
