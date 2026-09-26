---
layout: getting-started.html.njk
title: Theming and CSS/JavaScript frameworks
rightsidebar:
author: david
publicationDate: August 3, 2026
step: 9
---

_AkashaCMS supports your right to control every aspect of HTML pages you generate._  That's what we said when describing [describing layouts and partials](templates.html).  You can design page layout templates at the HTML element level, and you can override almost every partial template used by one of the custom tags.

The next level is the choice to use one CSS/JavaScript framework or another.  Choosing a CSS/JavaScript framework usually means including links to CSS stylesheet and JavaScript files in your page header or page footer.

You're free to choose any such framework, or to skip using a framework and roll your own CSS and JavaScript theming.

The only framework we've invested effort in integration for AkashaCMS is the Bootstrap framework.  The [`@akashacms/theme-bootstrap`](https://www.npmjs.com/package/@akashacms/theme-bootstrap) package supports both the obselent 4.6.x Boostrap release, and the latest 5.3.x Bootstrap release.

Injecting CSS/JavaScript files into your pages means using these custom tags along with associated configuration.

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

These custom tags let you declare CSS and JavaScript files in the Configuration file.  The files specified via the `addFooterJavaScript`, `addHeaderJavaScript`, and `addStylesheet` functions are added to the HTML via these tags.

It's a best practice to host your CSS or JavaScript files yourself.  That way you're not dependent on the health of a third party service.  All these projects offer the CSS/JavaScript files via a CDN (content delivery network), but what if the CDN goes down while your webserver is still running?  Your site would be nonfunctional with no way to fix it other than to wait for the CDN to repair itself.

## The process for installing CSS/JS framework files in an AkashaCMS project

Each CSS/JS framework will document the files required to use their framework on your web pages.

For Bootstrap v5, go here: https://getbootstrap.com/docs/5.3/getting-started/download/

You'll learn that v5.x requires the `bootstrap` and `@popperjs/core` packages.  That page more clearly documents the URLs for use from the Bootstrap CDN.  The primary thing to learn from those URLs is the two required packages.

For an AkashaCMS project one can use npm, yarn, or other package manager to install the packages in your project:

```shell
npm install bootstrap@5.3.8 @popperjs/core@2.11.8 --save
```

You then add these dependencies to `package.json`

```json
  "dependencies": {
    "@popperjs/core": "^2.11.8",
    "bootstrap": "^5.3.8"
  }
```

This lets you easily change the version number for each package.  The `npm install` command will then make sure you've installed the correct version of these dependencies.

Next, in `config.js`, add these lines:

```js
config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
    .addAssetsDir({
        src: 'node_modules/@popperjs/core/dist',
        dest: 'vendor/popper.js'
    })
```

This maps the Bootstrap, jQuery and Popper distributions into appropriate `/vendor` directories.

Then in `config.js` add this:

```js
config
    .addFooterJavaScript({ href: "/vendor/popper.js/umd/popper.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({ href: "/style.css" })
```

Recall that:

* `addFooterJavascript` adds code to the bottom of the page to load JavaScript files
* `addHeaderJavascript` adds code to the `<head>` section of the page to load JavaScript files
* `addStylesheet` adds code to the `<head>` section of the page to load CSS files

These config function calls add Bootstrap and PopperJS to your pages.  We've also included a `style.css` that is useful to hold your custom CSS declarations.

You can easily modify this process for any CSS/JS framework.  Just modify the details to suit.  Install the files from any other framework, mount those directories into your output directory, and add them to the configuration.

## For Bootstrap, use `@akashacms/theme-bootstrap`

The `@akashacms/theme-bootstrap` plugin takes care of all those dependencies and config file settings.

In `package.json` you do this:

```json
"dependencies": {
    ...
    "@akashacms/theme-bootstrap": "^5.x",
}
```

NOTE: Currently the 5.x branch is not published to npm, and instead you use `akashacms/akashacms-theme-bootstrap#5.x`.

Then, in the configuration file:

```js
import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
// ...

config
    .use(ThemeBootstrapPlugin)
    // ...
```

That's it.

The plugin takes care of adding the `addFooterJavascrip` and `addStylesheet` calls.

Further, the plugin contains overrides for partial templates from other plugins that use Bootstrap goodness.

## Theming Bootstrap or other CSS/JS frameworks

There's a whole industry of theme files for Bootstrap or other CSS/JS frameworks.

In the Bootstrap universe, one resource is https://bootstrap.build/, which has a few starter themes as well as an in-browser GUI for further customizations.

What results is a `bootstrap.min.css` file which you can download and add to an `assets` directory.

Issue https://github.com/akashacms/akasharender/issues/237 covers creating a configuration option in `@akashacms/theme-bootstrap` to override the default file with a new one.

This configuration snippet shows a manual configuration to rename the `bootstrap.min.css` from the Pulse theme to `pulse.min.css`, and to use that.

```js
config
    .addStylesheet({ href: "/pulse.min.css" })
    .addStylesheet({ href: "/style.css" })
```

This allows the declarations in the theme CSS file to override whatever was declared in the Bootstrap distribution.


