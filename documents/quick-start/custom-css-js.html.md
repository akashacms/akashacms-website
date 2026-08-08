---
layout: getting-started.html.njk
title: Custom CSS/JavaScript on individual pages
rightsidebar:
author: david
publicationDate: May 7, 2021
headerStylesheetsAdd:
    - href: /vendor/gridjs/theme/mermaid.css
headerJavaScriptAddBottom:
    - href: /vendor/gridjs/gridjs.production.min.js
    - href: /quick-start/js/gridjs.js
step: 10
---

Out of the box, AkashaCMS has a simple way to use the same CSS/JavaScript files on each page.  This is a key part of having a consistent look and feel across your website.  We covered this in  [](theming.html)

But, what if you need some special behavior on a specific page?

It's also easy to add specific CSS or JS files to specific pages.

AkashaCMS handles both site-wide CSS and JavaScript, as well as per-page CSS and JavaScript.  Both are handled by using the `<ak-stylesheets>`, `<ak-headerJavaScript>`, and `<ak-footerJavaScript>` custom tags.

For site-wide CSS and JavaScript files, we make a site-wide configuration in the `config.mjs` file.  Namely, we use `addAssetsDir` to add the directory for a CSS or JavaScript framework, then we use the `addStylesheet`, `addFooterJavaScript`, and `addHeaderJavaScript` functions to add CSS and JS files to the list used by the `<ak-stylesheets>`, `<ak-headerJavaScript>`, and `<ak-footerJavaScript>` custom tags.

We can implement per-page CSS and JavaScript by using `headerStylesheetsAdd`, `headerJavaScriptAddBottom`, or `headerJavaScriptAddTop` declarations in the frontmatter of a page.  These make a per-page addition to those same lists, so when the page layout template sees the `<ak-stylesheets>`, `<ak-headerJavaScript>`, and `<ak-footerJavaScript>` custom tags, the page will have additional files.

To see how this works, let's install [GridJS](https://gridjs.io) and show a sample table.

## Installing the GridJS package

To start, let's use `npm` to install the GridJS package.  In an AkashaCMS project directory, run this:

```
$ npm install gridjs --save
```

This installs the current version of GridJS into the `node_modules` directory.  This package does not contain code that runs inside Node.js, but instead contains browser code.

## Configuring the AkashaCMS project to recognize the GridJS package

In the project configuration file, `config.mjs`, add this:

```js
config
    ...
    .addAssetsDir({
        src: 'node_modules/gridjs/dist',
        dest: 'vendor/gridjs'
    })
    ...
```

This ensures the GridJS distribution is copied into the rendering directory at `/vendor/gridjs`.

At this point, if you want to use GridJS on every page of the site, add the CSS and JavaScript files in `config.mjs` as discussed in [the theming guide](theming.html).

## Adding the CSS and JavaScript required for GridJS to a page

On each such page add the following to the document frontmatter:

```yaml
headerStylesheetsAdd:
    - href: /vendor/gridjs/theme/mermaid.css
headerJavaScriptAddBottom:
    - href: /vendor/gridjs/gridjs.production.min.js
    - href: /quick-start/js/gridjs.js
```

The `headerStylesheetsAdd` value works with the `<ak-stylesheets>` tag to insert the named stylesheets.

Likewise, the `headerJavaScriptAddBottom` value works with the `<ak-footerJavaScript>` tag to insert the named JavaScript.  As the name implies, this adds to the JavaScript injected at the bottom of the page.  For JavaScript files injected in the `<head>` section, use `headerJavaScriptAddTop` instead.

In each case the `href` tag refers to the file to be used.  For the stylesheets, this corresponds to the `href` attribute in `<link rel="stylesheet" type="text/css" href=""/>` tags, and for JavaScript files it corresponds to the `src` attribute in `<script>` tags.

The `href` values shown here reference local files in the deployed website.  If desired you can reference files on other servers with `https://` URL's.  In this case we have two files being used from the GridJS package, and one custom file.

## Example of using GridJS after adding it to a page

In GridJS, we add a `<div>` tag into which a GridJS-managed table is rendered.  We then run some JavaScript that retrieves data to show in the table, handle the rendering, and all other interaction.

In the above frontmatter, that JavaScript code is in `/quick-start/js/gridjs.js`.

Here is a sample target for GridJS:

```html
<div id="wrapper-search-style"></div>
```


The matching entry in the `js/gridjs.js` is:

```js
new gridjs.Grid({
    search: true,
    sort: true,
    columns: ["Name", "Email", "Phone Number"],
    style: {
        table: {
            border: '3px solid #ccc'
        },
        th: {
            'background-color': 'rgba(0, 0, 0, 0.1)',
            color: '#000',
            'border-bottom': '3px solid #ccc',
            'text-align': 'center'
        },
        td: {
            'text-align': 'center'
        }
    },
    data: [
        ["John", "john@example.com", "(353) 01 222 3333"],
        ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
        ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
        ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
        ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
    ]
}).render(document.getElementById("wrapper-search-style"));
```

This supports searching, sorting, and custom CSS for the table.  If this were a GridJS tutorial we might have more to say about all that.  Instead our purpose is to show the mechanism for brining tools like this into an AkashaCMS project.

That results in the following table:

<div id="wrapper-search-style"></div>

# Summary

These steps were followed to add custom JavaScript and CSS to a page rendered by AkashaCMS:

1. Install a package from the npm repository.  The files can be installed using other means, or they can be referenced using `https://` URL's off of a CDN.
1. If the files are installed locally, add an `addAssetsDir` directive to the `config.js`
1. In the page frontmatter add suitable `headerStylesheetsAdd` and `headerJavaScriptAddBottom` values
1. In the case of GridJS, we are required to write a custom JavaScript file for rendering the table


