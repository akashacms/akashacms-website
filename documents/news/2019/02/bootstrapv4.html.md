---
layout: blog.html.njk
title: Updating an AkashaCMS site to use Bootstrap v4.3.x
publicationDate: February 25, 2019
blogtag: news
teaser: |
    Bootstrap v4 has been out for a long time, and it's high time we here in the AkashaCMS project moved forward.  I've just gone through the exercise of converting <tt>akashacms.com</tt> to use Bootstrap v4, and should therefore document what I had to do.  It wasn't terribly hard but I think it was harder than necessary, and will study how to streamline the process.
---

The first step is to bring in the experimental branch of `akashacms-theme-bootstrap`.  This plugin provides useful partial-template overrides to make things look nicer when Bootstrap is available.  For the moment to get the Bootstrap v4 version, reference the `bootstrapv4` branch from the repository using this in your `package.json`:

```json
"akashacms-theme-bootstrap": "akashacms/akashacms-theme-bootstrap#bootstrapv4",
```

Since this plugin does not bring in the Bootstrap code, you must do so yourself.

Again in `package.json` use the following:

```json
"jquery": "^3.3.x",
"bootstrap": "^4.3.x",
"popper.js": ">=1.14.x",
```

Bootstrap v4 depends not just on jQuery but Popper, and this brings in the current version npm packages of each as of this writing.  I prefer downloading the npm packages rather than relying on the CDN associated with each project.

Since Bootstrap v4 does not have built-in icons, it is also useful to bring in one of the icon libraries.  I prefer the Fontawesome library, and you can load the npm package in `package.json` as so:

```json
"@fortawesome/fontawesome-free": "^5.7.2"
```

In `config.js` you can mount each of these directories so they'll appear in the rendered directory:

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
     .addAssetsDir({
          src: 'node_modules/@fortawesome/fontawesome-free/',
          dest: 'vendor/fontawesome-free'
      });
```

Each of these will appear in the corresponding directory under `/vendor`.

To load the associated CSS and JavaScript, add this in `config.js`:

```js
config
    .addFooterJavaScript({
        href: "/vendor/jquery/jquery.min.js"
    })
    .addFooterJavaScript({
        href: "/vendor/popper.js/umd/popper.min.js"
    })
    .addFooterJavaScript({
        href: "/vendor/bootstrap/js/bootstrap.min.js"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap.min.css"
    })
    .addStylesheet({
        href: "/pulse.min.css"
    })
    .addStylesheet({
        href: "/style.css"
    })
    .addStylesheet({
        href: "/vendor/fontawesome-free/css/all.min.css"
    });
```

In your layout template add these declaratives as usual:

```html
<html>
<head>
    ...
    <ak-stylesheets></ak-stylesheets>
    <ak-headerJavaScript></ak-headerJavaScript>
    ...
</head>
<body>
    ...
    <ak-footerJavaScript></ak-footerJavaScript>
</body>
</html>
```

Between the `config.js` declarations and these declaratives, we cause the corresponding CSS and JavaScript files to be loaded.  The `pulse.min.css` file comes from the Pulse theme on the Bootswatch website.  In `style.css` is custom styling for `akashacms.com`.

We should be almost done at this point, but it took me a long time to wrangle out all the kinks.

The steps involved:

* Editing each layout template to use Bootstrap v4 classes
* Editing each partial template to use Bootstrap v4 classes
* Going over every page type to verify the site is still useful
* Convert any `glyphicon` references to the icon set you've chosen

For example `<span class="fas fa-js"></span>` is supported by the Fontawesome library to produce this icon:  <span class="fas fa-js"></span>

And it can do other things like:

<div class="fa-3x">
  <i class="fas fa-spinner fa-spin"></i>
  <i class="fas fa-circle-notch fa-spin"></i>
  <i class="fas fa-sync fa-spin"></i>
  <i class="fas fa-cog fa-spin"></i>
  <i class="fas fa-spinner fa-pulse"></i>
  <i class="fas fa-star-christmas fa-spin"></i>
</div>

And these

<span class="fa-stack fa-2x">
  <i class="fas fa-square fa-stack-2x"></i>
  <i class="fab fa-twitter fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-2x">
  <i class="fas fa-circle fa-stack-2x"></i>
  <i class="fas fa-flag fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-2x">
  <i class="fas fa-square fa-stack-2x"></i>
  <i class="fas fa-terminal fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-4x">
  <i class="fas fa-square fa-stack-2x"></i>
  <i class="fas fa-terminal fa-stack-1x fa-inverse"></i>
</span>
<span class="fa-stack fa-2x">
  <i class="fas fa-camera fa-stack-1x"></i>
  <i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
</span>

