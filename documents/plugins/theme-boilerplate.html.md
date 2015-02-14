---
layout: article.html.ejs
title: Theme for AkashaCMS using HTML5 Boilerplate (akashacms-theme-boilerplate)
rightsidebar:
---

This allows using the [HTML5 Boilerplate framework](http://html5boilerplate.com/) as the base theme of an AkashaCMS website.

We currently incorporate Boilerplate v5.  The distribution gets lightly modified for use with AkashaCMS.  See the [akashacms-theme-boilerplate project page](https://github.com/robogeek/akashacms-theme-boilerplate) for the source, or to submit patches.

To use the theme, add `akashacms-theme-boilerplate` to the plugin list like so

```js
akasha.registerPlugins(module.exports, [
    { name: 'akashacms-theme-boilerplate', plugin: require('akashacms-theme-boilerplate') },
    ... other plugins
]);
```

Then, in your page layout chain use this as the final layout:

```
---
...
layout: h5bp_page.html.ejs
...
---
```

Every page using that layout will use the full HTML5 Boilerplate page, adapted from the HTML recommended by the Boilerplate team.

The Boilerplate theme adds several CSS and JavaScript files to the `config.headerScripts` object from the Boilerplate project.  It's possible to override these files by adding a `config.themeBoilerplate` object to `config.js`.

```js
themeBoilerplate: {
    skipJQuery: true
    // add other options
},
```

* `config.themeBoilerplate.normalizeUrl`: The url for `normalize.css`
* `config.themeBoilerplate.modernizrUrl`: The url for `modernizer.js`
* `config.themeBoilerplate.skipJQuery`: Do not include jQuery code.  For example you may prefer a different jQuery version.
* `config.themeBoilerplate.jQueryUrl`: Change the URL from which to fetch jQuery.  By default it is the Google CDN, as recommended by the Boilerplate team.
* `config.themeBoilerplate.jQueryFallback`: Change the JavaScript which fetches jQuery if the jQueryUrl didn't work.  The Boilerplate team put this in so one can develop code when offline.

These options will make sense by studying the recommended HTML shown below, and the `h5bp_page.html.ejs` layout.

With v5 the Boilerplate team suggests this base page structure.  The `h5bp_page.html.ejs` layout is adapted from this recommendation, and the `config.headerScripts` are added in the recommended order but with `/boilerplate/` prepended to each path.  Note that they recommend jQuery 1.11.2.

```html
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.8.3.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        <p>Hello world! This is HTML5 Boilerplate.</p>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
        </script>
    </body>
</html>
```