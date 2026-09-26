---
layout: getting-started.html.njk
title: Integrating icon resources in AkashaCMS
rightsidebar:
author: david
publicationDate: August 3, 2026
step: 14
---

There are many free or paid icon libraries available that can spiff up your content with useful imagry.  With a simple bit of HTML, one can add a small image (an icon) to a website, whether it is a button, or is a visual emphasis to a presentation.

Most icon libraries contain a directory hierarchy full of PNG or SVG files.  There may be CSS files to aid with displaying an icon.

Typically, your HTML will do something like:

```html
<img src="/vendor/icon-library/path/to/image.svg"/>
```

You then wrap that up in suitable HTML wizardry for your website.

For AkashaCMS, it means adding an asset directory for each icon library to your project configuration.

The AkashaCMS ecosystem currently contains plugins for these icon libraries:

* `@akashacms/bootstrap-icons` - Simple wrapper bringing bootstrap-icons to AkashaCMS
* `@akashacms/country-code-icons` - Simple wrapper bringing country-code-icons to AkashaCMS
* `@akashacms/tabler-icons` - Integrates `@tabler/icons` for use in AkashaCMS projects

## Installation and configuration

Install one or more of the icon library plugins:

```shell
$ npm install @akashacms/bootstrap-icons \
        @akashacms/country-code-icons \
        @akashacms/tabler-icons \
        --save
```

In `config.mjs`, enable one or more plugin:

```js
import { BootstrapIconsPlugin } from '@akashacms/bootstrap-icons';
import { TablerIconsPlugin } from '@akashacms/tabler-icons';
import { CountryFlagIconsPlugin } from '@akashacms/country-flag-icons';

// ...

config
    // ...
    .use(BootstrapIconsPlugin)
    .use(CountryFlagIconsPlugin)
    .use(TablerIconsPlugin)
    // ...
```

## Using one of the existing icon libraries

Each of these plugins are used in nearly the same way.  The source website for each tends to have an online browser for the icons.  Each icon has a code name that is used in the file name within the icon library.

For example, go to [`icons.getbootstrap.com`](https://icons.getbootstrap.com/) to find the Bootstrap Icons browser.

The camera icon has the code name `camera`.  Bootstrap Icons has two usage models, a) web font, and b) SVG files.

The `@akashacms/bootstrap-icons` plugin has made it easy to use both models, prewiring the AkashaCMS configuration to support both.

The web font mode lets you use an icon this way: `<i class="bi bi-camera"></i>`

Which results in: <i class="bi bi-camera"></i>

To reference the SVG file use this:

```html
<img src="/vendor/bootstrap-icons/icons/camera.svg"/>
```

Additional attributes like `id=`, `class=`, `width=`, `height=`, `alt=`, `title=` and `style=`, can be added for customization.

Result:

<img src="/vendor/bootstrap-icons/camera.svg"/>

## Integrating an icon library from scratch

What if you've found an icon library for which there is not an AkashaCMS plugin?

The process of creating a plugin, or otherwise integrating it with AkashaCMS, is simple.  To see, let's look at the `@akashacms/bootstrap-icons` source file.

### Downloading the icon library

The first step is to download the icon library.  In the case of Bootstrap icons, there is an NPM package, `bootstrap-icons`.  But, the website contains a released package you can download as a TAR or ZIP file.

Many such libraries talk about using their CDN.  That's not a best practice, since the stability of your website would then depend on the stability of their CDN.  Further, there is a personal information issue given that the CDN operator might be collecting data from the web browsers requesting image or font files.

The best practice is to download the package, and install it on the same web server which hosts your website.

If the icon library is distributed through NPM, you can do:

```shell
npm install icon-library-name --save
```

This adds the dependency in your `package.json` making it easier to update to a new release.

You will find the icon library somewhere inside `node_modules`, like so:

```shell
$ ls node_modules/bootstrap-icons/
bootstrap-icons.svg  font  icons  LICENSE  package.json  README.md
```

In this case the `icons` directory contains the thousands of SVG files making up the library.  The `font` library contains some CSS files, as well as font files.

### Adding icon library directories to AkashaCMS configuration

Having explored the library contents, we can map those into the AkashaCMS configuration.

```js
import path from 'node:path';

const resolvIconsPkg = import.meta.resolve('bootstrap-icons/package.json');
const pathIconsPkg = path.dirname(new URL(resolvIconsPkg).pathname);
const dirIconsBase = '/vendor/bootstrap-icons';
// ...
config.addAssetsDir({
    src: pathIconsPkg,
    dest: dirIconsBase
});
// ...
config.addStylesheet({
    href: path.join(dirIconsBase, 'font', 'bootstrap-icons.min.css')
});
// ...
```

The first set of lines compute the filesystem location for the installed package.  While you could hard-code `node_modules/bootstrap-icons/icons`, what if NPM decides to install the bootstrap-icons package elsewhere?  Using `import.meta.resolve` like this is immune to that issue.

In `config.addAssetsDir` you see the filesystem directory being added to the directory `/vendor/bootstrap-icons`.  It is a common practice to locate 3rd party files like this in the `/vendor` directory.

The last is to add the CSS file to the stylesheet list.

Look at the entirety of the `@akashacms/bootstrap-icons` package to see just how simple the integration process is.


