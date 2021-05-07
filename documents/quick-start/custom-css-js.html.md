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
---

There are many kinds of front-end libraries we might use for special effects on our websites.  We might use a layout framework, like Bootstrap, to handle both site theming and page layout.  For that, it's most likely that every page of the website will use the same CSS stylesheets and JavaScript files.  We covered that use case in: [](theming.html)

In other cases a specific page will need a specific library or other custom file just for that page.  It doesn't make sense to inject the CSS or JavaScript used solely by one page into every page of the site.  Instead, what makes sense is that each page have the ability to declare the CSS and JavaScript files it needs.

AkashaCMS handles both site-wide CSS and JavaScript, as well as per-page CSS and JavaScript.  It is encouraged that page layout templates use the `<ak-stylesheets>`, `<ak-headerJavaScript>`, and `<ak-footerJavaScript>` custom tags to load CSS and JavaScript into a page.

In [](theming.html), we showed how to configure those tags for site-wide theming.  These tags also pick up information from the page metadata to add specific CSS or JavaScript files to be loaded just for that page.

Namely, we add `headerStylesheetsAdd`, `headerJavaScriptAddBottom`, or `headerJavaScriptAddTop` declarations in the frontmatter of each page where custom CSS or JavaScript files are needed.  To see how this works, let's install [GridJS](https://gridjs.io) and show a sample table.

## Installing the GridJS package

To start, let's use `npm` to install the GridJS package.  In an AkashaCMS project directory, run this:

```
$ npm install gridjs --save
```

This installs the current version of GridJS into the `node_modules` directory.  This package does not contain code that runs inside Node.js, but instead contains browser code.

## Configuring the AkashaCMS project to recognize the GridJS package

In the project configuration file, `config.js`, add this:

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

You might want to support GridJS use on every page of the site, in which case you consult [the theming guide](theming.html) to add references to the CSS and JavaScript files.  But instead we want to support using this on specific pages.

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


