---
layout: article.html.ejs
title: AkashaCMS plugins
rightsidebar:
publicationDate: Jan 1, 2015
authorname: david
---
AkashaCMS can be extended using a flexible plugin system.  Consult the [directory of known plugins](../plugins/index.html) to see if the one you desire has already been built.  If not, Plugins are easy to implement and can do a wide range of things including

* Provide page layouts
* Provide assets contents
* Provide partials
* Provide template functions
* Listen to, and react to, events emitted by AkashaCMS during processing

# Configuring plugins for a site

In the site config file, plugins are invoked this way:

    config: function(akasha) {
        akasha.registerPlugins(module.exports, [
            { name: 'akashacms-theme-bootstrap', plugin: require('akashacms-theme-bootstrap') },
            { name: 'akashacms-breadcrumbs', plugin: require('akashacms-breadcrumbs') },
            { name: 'akashacms-booknav', plugin: require('akashacms-booknav') },
            { name: 'akashacms-embeddables', plugin: require('akashacms-embeddables') },
            { name: 'akashacms-social-buttons', plugin: require('akashacms-social-buttons') },
            { name: 'akashacms-tagged-content', plugin: require('akashacms-tagged-content') },
            { name: 'akashacms-base', plugin: require('akashacms-base') }
        ]);
    }

Each entry in the array is an object describing the plugin.  The module reference is require'd inside the config file so that it is resolved relative to the config file.  If desired the module reference can be a string instead, but in that case it is AkashaCMS which require's the module, and the module location is resolved relative to where AkashaCMS is installed.

A plugin can override behavior (functions) or templates (layouts, or partials) defined by a plugin farther down the list.  In this plugin config, we've placed `akashacms-theme-bootstrap` first because some of its partials override partials defined in other plugins.  Those partials have bootstrap-specific markup and should make a site look better.

The general rule is a plugin overrides things defined in plugins further down this list.  We'll see in a minute how this is done.

One effect is that `akashacms-base` is designed to be the last plugin on the list, so that other plugins can override it.

# Coding a plugin

An AkashaCMS plugin is simply a Node.js module that has a function with this signature:

    module.exports.config = function(akasha, config) {
        ... config function
    }

The `config` function is called while initializing AkashaCMS.  The `akasha` object provided is the `akashacms` module, while the `config` object is the configuration file.

A common task is to add a directory to `root_assets`, `root_layouts` or `root_partials`, when the plugin wants to provide files of its own.

    module.exports.config = function(akasha, config) {
        config.root_partials.push(path.join(__dirname, 'partials'));
        config.root_layouts.push(path.join(__dirname, 'layout'));
        config.root_assets.unshift(path.join(__dirname, 'assets'));
        ...
    }

Remember that AkashaCMS searches these arrays to find files.  By adding its own directories to these arrays, a plugin provides its own files for use in rendering a website.

There's a careful dance played in whether a directory is pushed or unshifted into an array.  Remember that the goal is for a plugin that's early in the list to override plugins later in the list.  Remember that `push` inserts items on the end of the array, while `unshift` inserts items at the beginning.  This seemingly minor point is important for maintaining the correct idea of which plugin is first.

What's different is that

* for `root_partials` and `root_layouts`, AkashaCMS searches for the first matching file, stopping when it finds one.  For a layout or partial template in one plugin to override one in another plugin, the plugin has to be scanned first.
* for `root_assets`, AkashaCMS copies the file tree of each named directory in turn.  For a file in a plugin asset directory to override an identically-named file in another plugin, the plugin's assets directory has to be copied second.

If you're unclear about the order of entries in these arrays, this command prints out the configuration data:

    $ akashacms config

That is... for any website with a few plugins, the content of the `root_partials` and `root_layouts` arrays will be something like

    [ site, P1, P2, P3, P4, ... ]

AkashaCMS, searching for a partial named `reddit-this.html.ejs` will look in these directories in order

    site/partials/reddit-this.html.ejs
    /path/to/P1/partials/reddit-this.html.ejs
    /path/to/P2/partials/reddit-this.html.ejs
    /path/to/P3/partials/reddit-this.html.ejs
    /path/to/P4/partials/reddit-this.html.ejs
    ...

Suppose both `site/partials/reddit-this.html.ejs` and `P3/partials/reddit-this.html.ejs` exist.  The first one on the list, `site/partials/reddit-this.html.ejs`, will be used because AkashaCMS will find it first.

## API to access a plugin module

While the primary purpose for plugins is to provide partials or Mahabhuta functions, they can also provide functions.  That requires accessing the plugin module.

    akasha.plugin('plugin-name').pluginFunction(...arguments...);

The `plugin-name` of course must be the same as a registered plugin name, as seen above.

The plugin would have a function like so:

    module.exports.helloWorld = function() {
       return "Hello, World!";
    };

Then calling `akasha.plugin('plugin-name').helloWorld()` returns the string shown above.

Additionally, in an EJS template the `plugin` function is available so you can do this:

    <%= plugin('plugin-name').helloWorld() %>

## Per-site plugin configuration data

In some cases plugins will need some data to configure plugin behavior.  For example, the `akashacms-embeddables` plugin requires a authentication key from Google to allow access to the YouTube API.

Since that configuration data needs to reside in `config.js` we need some rules-of-the-road to share that common resource in a way that plugins don't step on each other.

First - we recommend naming plugins with dash's in their name:  `akashacms-embeddables` etc

Second - that dash-separated name then translates to a camelCase name:  `akashacmsEmbeddables`

Use the camelCase name in the `config.js` as the root object of config data for the plugin:

    akashacmsEmbeddables: {
        ... data for plugin
    }

The plugin can then access the data as so:  `config.akashacmsEmbeddables....`

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
    }

## Pluggable Renderers

AkashaCMS allows a plugin to define new rendering chains.  These are documented by the file-name extension, with each combination of extensions indicating different rendering steps.  For example, among [the built-in rendering chains](../documents/extensions.html) is support for `.html.ejs.md` files.  Such files are first rendered from Markdown to HTML, then processed using EJS, to finally produce HTML output.

See [](../documents/rendering-chains.html) for details.

# Mahabhuta functions

Plugins can add [Mahabhuta](/documents/mahabhuta.html) functions to support additional tags or perform additional DOM manipulations.  Simply create an array, `module.exports.mahabhuta`, containing Mahabhuta functions.  During the `registerPlugins` process, this array of functions will be detected and registered in the master list of Mahabhuta functions.

    module.exports.mahabhuta = [
        function($, metadata, dirty, done) {
        	logger.trace('ak-teaser');
            var elements = [];
            $('ak-teaser').each(function(i, elem) { elements.push(elem); });
            async.eachSeries(elements,
            function(element, next) {
				if (typeof metadata.teaser !== "undefined" || typeof metadata["ak-teaser"] !== "undefined") {
						akasha.partial("ak_teaser.html.ejs", {
								teaser: typeof metadata["ak-teaser"] !== "undefined"
									? metadata["ak-teaser"] : metadata.teaser
							},
							function(err, html) {
								if (err) next(err);
								else {
										$(element).replaceWith(html);
										next();
								}
							});
				} else {
					$(element).remove();
					next();
				}
            }, 
            function(err) {
				if (err) {
					logger.error('ak-teaser Errored with '+ util.inspect(err));
					done(err);
				} else done();
            });
        },
        
        ... other functions
    ];

# The _akashacms-base_ plugin

The AkashaCMS-base plugin provides some basic functions, partials and assets.  As I pondered the AkashaCMS design, it was clear  fundamental content management and layout capabilities were needed, designed to be last on the list of plugins, allowing any other plugin to override its behavior.  That thought lead to the `akashacms-base` plugin.
