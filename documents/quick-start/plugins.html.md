---
layout: getting-started.html.njk
title: Using plugins in AkashaCMS projects
rightsidebar:
author: david
publicationDate: February 22, 2021
---

Remember that AkashaCMS is a loose term referring to an ecosystem centered on AkashaRender and Mahabhuta, and that we extend the capability of those modules by adding plugins.  AkashaRender is the name for the rendering system at the heart of AkashaCMS, while Mahabhuta handles server-side DOM processing to support both custom HTML tags and custom HTML manipulations.  A typical AkashaCMS plugin adds a Partials directory, and supports a few custom tags.

Anyone can write a plugin for AkashaCMS.  We maintain a list of known plugins:  [](/plugins/index.html).

# Adding an AkashaCMS plugin to a project

The first step is determining whether you need a plugin.  Browse the list of plugins to see if any fit your needs.  If one works for you, then proceed with adding it to your project.  But if your need is not satisfied by an existing plugin, perhaps you need to write one, or at the minimum create some custom tags with Mahabhuta.

Having determined to use a plugin, the next step is to install it.  Since we're using a npm/Yarn `package.json` to manage the project:

```
$ npm install @akashacms/plugins-base --save
```

Most of the plugins listed in the directory are in the `@akashacms` namespace in the npm registry.  A few are elsewhere, including being accessed directly from a Github repository.  Remember to add the `--save` option to ensure the dependency is added to `package.json`.

Installing the package this way ensures that running `npm install` later will automatically install the plugin.

The next step is to add the plugin to the Configuration:

```js
config
    .use(require('@akashacms/plugins-base'), {
        generateSitemapFlag: true
    })
```

In other words, you simply use `require` to load the package.  What the `use` method actually requires is a JavaScript class that extends the `Plugin` class.  The convention is that a package which is an AkashaCMS plugin will export its Plugin class such that `require('plugin-package-name')` works correctly.  If you're handy with coding, you can supply the Plugin class via another mechanism.

Many plugins can be configured to tailor their behavior.  We've shown here a configuration object being passed to the `use` method.  This object will be documented by the plugin.

Plugins usually can also be configured by calling a plugin method.

# Calling a plugin method

Since a Plugin is a JavaScript object, it can have methods and data.  Many plugins offer useful methods which can be called.

The Configuration object has a method with which we access the Plugin object:

```js
config.plugin('@akashacms/plugins-base')
```

If the named plugin exists, it will be returned, giving us the Plugin instance.

To invoke a plugin method we simply call it:

```js
config.plugin('@akashacms/plugins-base').generateSitemap(config, true);

config.plugin("akashacms-external-links")
    .setTargetBlank(config, true)
    .setShowFavicons(config, "before");
```

It's probably better to configure a plugin with its config object, but these methods can be called instead of you prefer.

# Using plugin methods from a template

Sometimes plugins supply methods that make sense to be called from a template.  In such a case you can either use a custom tag, or directly call the function that corresponds to the custom tag.  It's been observed that directly calling the function can be a performance boost.

For example let's examine these tags:

```html
<ak-stylesheets></ak-stylesheets>
<ak-headerJavaScript></ak-headerJavaScript>
...
<ak-footerJavaScript></ak-footerJavaScript>
```

These custom tags are supplied by the `akashacms-builtin` plugin.  The processing is handled through Mahabhuta to first see the tag, then to invoke the function to generate the corresponding HTML.  It is clearly faster to just directly invoke the function, than to invoke it through Mahabhuta.  Since these tags will be in a page layout template, the custom tag will be processed on every page using this template.  Therefore switching to direct invocation can improve site rendering time.

Here's what's required in an EJS template:

```html
<%- config.plugin("akashacms-builtin").doStylesheets(locals) %>
<%- config.plugin("akashacms-builtin").doHeaderJavaScript(locals) %>
...
<%- config.plugin("akashacms-builtin").doFooterJavaScript(locals) %>
```

We use `config.plugin("akashacms-builtin")` because that's the plugin containing this functionality.  Then we call the corresponding plugin methods.  The `locals` parameter is how, in EJS templates, we pass the metadata object to the function.

With most template engines direct invocation is handled in roughly the same way.

In Nunjucks templates there is a slightly different process.  First we load some macros supplied by certain plugins:

```html
{% import "ak_core_macros.njk" as ak_core with context %}
{% import "ak_base_macros.njk" as ak_base with context %}
```

These macros simplify calling plugin methods from a Nunjucks template.  The `ak_core` macros are supplied by the `akashacms-builtin` plugin, and the `ak_base` macros are supplied by the `@akashacms/plugins-base` plugin.

Then we invoke the plugin methods like so:

```html
{{ ak_core.stylesheets() }}
{{ ak_core.headerJavaScript() }}
...
{{ ak_core.footerJavaScript() }}
```

If you study the macros you'll see quite a lot is hidden here, and you'll see that in some using the macro means not even invoking a plugin method.
