---
layout: article.html.ejs
title: Theme for AkashaCMS using Twitter Bootstrap (akashacms-theme-bootstrap)
rightsidebar:
---

This allows using the [Twitter Bootstrap framework](http://getbootstrap.com/) as the base theme of an AkashaCMS website.

We currently incorporate Bootstrap v3.0.  The distribution gets lightly modified for use with AkashaCMS.  See the [akashacms-theme-bootstrap project page](https://github.com/robogeek/akashacms-theme-bootstrap) for the source, or to submit patches.

To use the theme, add `akashacms-theme-bootstrap` to the plugin list like so:

```js
akasha.registerPlugins(module.exports, [
    { name: 'akashacms-theme-bootstrap', plugin: require('akashacms-theme-bootstrap') },
    ... other plugins
])
```

Then, in your page layout chain use this as the final layout:


```
---
...
layout: boot_page.html.ejs
...
---
```

Every page using that layout will use the full Bootstrap page, adapted from the HTML recommended by the Bootstrap team.

Additionally, this theme provides a number of partials that override partials from other plugins.  These re-implement Bootstrapified versions of various things.


The Bootstrap theme adds several CSS and JavaScript files to the `config.headerScripts` object from the Bootstrap project.  It's possible to override these files by adding a `config.themeBootstrap` object to `config.js`.  At the current writing, `akashacms-theme-bootstrap` is built on Bootstrap v3, but the Bootstrap team have moved on to v3.3.2.  You can override the built-in version, using that version or a custom-built Bootstrap just by modifying the options listed below.

```js
themeBootstrap: {
    // options
},
```

The options are:

* `config.themeBootstrap.bootstrapCSSurl`: The URL from which to retrieve `bootstrap.min.css`
* `config.themeBootstrap.bootstrapThemeCSSurl`: The URL from which to retrieve `bootstrap-theme.min.css`
* `config.themeBootstrap.useHtml5shiv`: Use the html5shiv library - see [https://github.com/aFarkas/html5shiv](https://github.com/aFarkas/html5shiv)
* `config.themeBootstrap.html5shivUrl`: The URL from which to retrieve this library.  If `useHtml5shiv` is specified, and `html5shivUrl` is not, then it defaults to `//oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js`.
* `config.themeBootstrap.useRespondJS`: Use the Respond.js library - see [https://github.com/scottjehl/Respond](https://github.com/scottjehl/Respond)
* `config.themeBootstrap.RespondJSUrl`: The URL from which to retrieve this library.  If `useRespondJS` is specified, and `RespondJSUrl` is not, then it defaults to `//oss.maxcdn.com/respond/1.4.2/respond.min.js`
* `config.themeBootstrap.bootstrapJSurl`: The URL from which to retrieve `bootstrap.min.js`
* `config.themeBootstrap.jQueryUrl`: The URL from which to retrieve jQuery

For example:

```js
themeBootstrap: {
    bootstrapCSSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css",
    bootstrapThemeCSSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css",
    bootstrapJSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js",
    useHtml5shiv: true,
    useRespondJS: true
},
```
