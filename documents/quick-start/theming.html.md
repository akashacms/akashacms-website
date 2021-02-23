---
layout: getting-started.html.njk
title: Theming and CSS/JavaScript frameworks
rightsidebar:
author: david
publicationDate: February 21, 2021
---

When [describing layouts and partials](templates.html) we said that _AkashaCMS supports your right to control every aspect of HTML pages you generate._  The primary reason is that you specify the layout templates used on your site, and you can override almost every partial template used by one of the custom tags.

There's another aspect to having full control over the HTML used in your project.  That is the choice of any CSS/JavaScript framework you'll use, or whether to use one at all.  You're free to choose any framework, or to skip using a framework and roll your own CSS and JavaScript theming.

However, the only framework we've invested any effort into using is Bootstrap.  The project started with Bootstrap v3, then migrated to Bootstrap v4, and is currently considering when to migrate to Bootstrap v5.  But it's intended that you can use any other framework you desire.

The first stage of establishing a theme is to inject desired CSS and JavaScript files into the rendered HTML.  We've already seen the intended method to do so:

```html
<html>
<head>
..
<ak-stylesheets></ak-stylesheets>
<ak-headerJavaScript></ak-headerJavaScript>
..
</head>
<body>
..
<ak-footerJavaScript></ak-footerJavaScript>
..
</body>
</html>
```

These custom tags let you declare CSS and JavaScript files in the Configuration file.  Whatever files you specify via the `addFooterJavaScript`, `addHeaderJavaScript`, and `addStylesheet` functions will be added to the HTML via these tags.  These functions allow adding files from the local filesystem, or from a CDN service.

It's a best practice to host your CSS or JavaScript files yourself.  That way you're not dependent on the health of a third party service.

For example to use Bootstrap v4, set these dependencies in your `package.json`:

```json
"dependencies": {
    ...
    "bootstrap": "^4.5.x",
    "jquery": "^3.5.x",
    "popper.js": "^1.16.x",
    ...
}
```

This installs the required packages into your `node_modules` directory.

Next, in `config.js`, add these lines:

```js
config
    .addAssetsDir('assets')
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
```

This maps the Bootstrap, jQuery and Popper distributions into appropriate `/vendor` directories.

Then in `config.js` add this:

```js
config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/popper.js/umd/popper.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({ href: "/style.css" })
```

This ensures the custom tags shown earlier will generate the required HTML to load Bootstrap support.  We've also included a `style.css` that is useful to hold your custom CSS declarations.

The JavaScript code is loaded in the footer because that's the best practice.  It is also loaded in the correct order for correct initialization.

Review back over the last few paragraphs, and notice that this mechanism allows you to use any other framework.  Instead of installing the Bootstrap files, install the files from any other framework you desire.  Then mount those directories into your output directory, and add them to the configuration.  The process would be the same, just with different file names.

The code shown here gives you the default Bootstrap theme.  It's a best practice to customize it to your preference.  There is a whole industry of providing customized Bootstrap themes.  The [BootSwatch](https://bootswatch.com/) site provides a handful of nice open source free themes for Bootstrap.

All that we require is the `.min.css` file from one of their themes.  Download one of the files, and add it to your `assets` directory.  It's helpful to rename the file from `bootstrap.min.css` so that the file name matches the name of the theme, if only so you can remember in six months which theme you used.

Then in the Configuration, change the stylesheet declarations to this:

```js
config
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({ href: "/pulse.min.css" })
    .addStylesheet({ href: "/style.css" })
```

This allows the declarations in the theme CSS file to override whatever was declared in the Bootstrap distribution.

