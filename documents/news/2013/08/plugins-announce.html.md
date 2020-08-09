---
layout: blog.html.njk
title: Preparing AkashaCMS for 0.3.x, adding plugin support
publicationDate: 2013-08-04 21:08
blogtag: news
teaser: |
    <p>I'm going to be declaring AkashaCMS 0.3.x pretty soon, and I have an interesting new feature in the works.  The idea is to support multi-way extensibility of the processing of a website via the configuration file.  The implementation is a form of "plugin" that allows anybody to write a module that extends the configuration of an AkashaCMS site, add new processing functions, hooks at different steps of the processing, and add directories managed by the plugin containing assets, layouts or partials.</p>

    <p>Okay, that was pretty dense so let's take it one step at a time.</p>
---

The first change was to make AkashaCMS configuration files use an array of directory names for - `assets`, `layouts` and `partials`.

When AkashaCMS looks for one of those kinds of files (or for Documents, for that matter) it searches through the array of such directories.  This means that in the configuration file you now declare these directories as so:

```
module.exports = {
    root_assets: [ 'boilerplate', 'assets' ],
    root_layouts: [ 'layouts' ],           // Directory for layout files
    root_partials: [ 'partials' ],         // Directory for partials
    ...
};
```

This by itself was kind of innocuous.  But, wait, there's more.

During initialization, in the `akashacms.config` function, AkashaCMS calls the `config` function of each plugin.  What's a plugin?  A plugin is an NPM-managed package, which exports a `config` function.  The plugin is given the config file and then can do something like this:

```
config.root_partials.push(path.join(__dirname, 'partials'));
```

What this does is add another directory to the `root_partials` array.  The directory in question happens to be inside the package hierarchy of the plugin.  That is, Plugins are regular NPM-managed modules, that export a `config` function where the plugin is going to do things of this sort.

By adding its own directory to the `root_partials` array, the plugin can back up any functions it adds with support for HTML formatting.

In the common use case, the `config` function is expected to add some functions that would be available in templates, and for those functions to use partials to render values.

A config function adds template functions this way:

```
config.funcs.siblings = function(arg, callback) {
    ..
}
```

Remember that any functions in the `config.funcs` object are available in templates and partials.  Such functions are called during processing a template or partial, and they're expected to gather up or process some data, then render that data through a partial.  Therefore, as shown earlier, a plugin can provide its own partial directory to provide its own partials.

AkashaCMS searches the `partials` and `layouts` directories in order, declaring success on the first match found.  Plugins that add their `partials` directory using the `push` function get their directory added at the end of the array.  This means a website can override a partial in a plugin, simply by providing a partial with the same name.  That's because the website own `partials` directory appears earlier in the `root_partials` array than does the plugin's `partials` directory.

What if a plugin wants to provide behavior other than functions evaluated while rendering templates?

AkashaCMS is beginning to emit messages while processing a website.  The messages haven't been thought through completely yet, but the idea is that a plugin will be able to react at different stages of processing a site.

Finally, I haven't said how plugins are declared.  The config file takes an array of plugin names.  These plugin names are of the same sort that are used in require statements.  In fact, this is how plugins are initialized:

```
// Pull in any plugins to extend AkashaCMS
for (var i = 0; i < options.plugins.length; i++) {
    require(options.plugins[i]).config(module.exports, options);
}
```

We step through the `plugins` array, `require`'ing each one, and calling its `config` function, passing in AkashaCMS and the `config` file.

The next step of AkashaCMS setup allows the `config` file to contain a `config` function:

```
// Then give the configuration file a shot at extending us
if (options.config) {
    options.config(module.exports);
}
```

The way this works is that a configuration file is really a module.  As a module, it can require modules, and it can contain code. I haven't written a plugin yet that uses this facility, but it seems like it'll be useful sometime.

A few plugins exist right now:

<ul>
<li>`akashacms-booknav`: Provides web page navigational elements similar to the book module in Drupal</li>
<li>`akashacms-breadcrumb`: Generates breadcrumb trails from the heirarchy of pages above this one</li>
<li>`akashacms-tagged-content`: Supports adding tags (taxonomy terms) to pages, and can generate tag clouds or index pages.  This plugin isn't finished yet.</li>
</ul>

 I may in the future implement some plugins that are internal to AkashaCMS, because it may be useful to provide some core functionality that is overridable.
