---
layout: blog.html.njk
title: Using GridJS for fancy searchable HTML tables on statically generated websites
publicationDate: May 6, 2021
blogtag: news
teaser: |
    There's a wide variety of JavaScript/CSS libraries to spiff up the front-end of a website.  In some cases we'll use the same CSS/JavaScript on every page if only for consistent layout code.  But in some cases we need a library only on specific pages.  For example, the GridJS library makes it easy to implement fancy tables with sorting and searching capabilities, but we probably don't want to use it on every page on the site.
# heroPicture:
#     url: /news/2020/08/img/what-is-jamstack.jpg
headerStylesheetsAdd:
    - href: /vendor/gridjs/theme/mermaid.css
headerJavaScriptAddBottom:
    - href: /vendor/gridjs/gridjs.production.min.js
    - href: /quick-start/js/gridjs.js
---

In the HTML of a web page, there are two places where the CSS and JavaScript tags should live.  One location is at the end of the `<head>` section, and the other location is at the end of the `<body>` section.  The recommended best practice is to load the CSS files in the `<head>` section, and to load the JavaScript at the bottom of the `<body>` section.

When building a website using a static website generator framework, it is important to have full control over theming.  That means being able to control, for each page, which CSS and JavaScript files are loaded in those two locations.  As we said above, the CSS/JavaScript used for page layout and theming is likely to be the same on every page of the website.  But, some pages might have specific needs for specific libraries.

For example we might use an Image Gallery library to support displaying large images.  But not every page has an image gallery, and therefore not every page needs to load the CSS/JavaScript for your chosen gallery framework.  Likewise, the subject of this article is to demonstrate using GridJS, a framework for building fancy tables.  Not every page needs such a table, and therefore it's best to load the GridJS library only on the pages needing its functionality.

# Installing GridJS for use with a statically generated website

In websites produced by a static website generator, you'll end up with a directory full of HTML, CSS, JavaScript, and Image files.  For it to be a static website, you're then uploading that site (probably using `rsync`) to a web host, and there should not be any server-side dynamic code.

The question is whether the libraries or frameworks should be among the files you load to your web host.  Most of these frameworks suggest you use the CSS and JavaScript files hosted on their CDN service.  For example, GridJS uses `unpkg.com` for distribution.  But, is that the best practice?

What if the CDN fails and is non-functional?  Your website would then be non-functional.  Isn't it a better practice to host the CSS/JavaScript files on your server to not be dependent on another server?

For that purpose, let's start with this:

```
$ npm install gridjs --save
```

For this to work you must have npm installed, of course.  Since the npm repository is widely used for distributing front end packages, you probably already have it installed, and are already familiar with using it.

This command of course not only downloads the GridJS package into the `node_modules`, it also saves the dependency descriptor into `package.json`.

Take a look in `node_modules/gridjs/dist` to see what's available to be used.

# Loading GridJS into a web page

The process for using GridJS in a specific web page will vary based on the static website generator you're using.  The goal is for the HTML to be structured something like this:


```html
<html>
<head>
..
<link rel="stylesheet" type="text/css" href="/vendor/gridjs/theme/mermaid.min.css"/>
..
</head>
<body>
..
<script src="/vendor/gridjs/gridjs.production.min.js"/>
..
</body>
</html>
```

To accomplish this on AkashaCMS, see [](/quick-start/custom-css-js.html)

The point is that this approach has no dependency on a 3rd party service, and is not dependent on someone elses web server to be running.

# Using GridJS to produce fancy tables

Now that GridJS is available in the specific pages, let's quickly run through how it's used.

We start with a `<div>` tag into which the GridJS table is rendered:

```html
<div id="wrapper-search"></div>
```

To use this container with GridJS we need some custom JavaScript to set up this table.  Any other table will require other custom JavaScript to set up that table.

Therefore the JavaScript to load must be this instead:

```js
<script src="/vendor/gridjs/gridjs.production.min.js"/>
<script src="/path/to/gridjs.js"/>
```

Then, the JavaScript file will contain an invocation like this:

```js
new gridjs.Grid({
    search: true,
    sort: true,
    columns: ["Name", "Email", "Phone Number"],
    data: [
        ["John", "john@example.com", "(353) 01 222 3333"],
        ["Mark", "mark@gmail.com", "(01) 22 888 4444"],
        ["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
        ["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
        ["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
    ]
}).render(document.getElementById("wrapper-search"));
```

This sets up a table with searching and sorting functionality, initialized with the static data shown here.  GridJS can also load data from a server, or elsewhere, and it can customize many other things.  We're not here to explain using GridJS, but to show how to integrate a JavaScript/CSS library into a statically generated website.

Once everything is setup, the result will be this:

<div id="wrapper-search"></div>

There is of course a whole lot more to GridJS than what we've shown here.  Instead, what we've shown is a summary of what's required, when using a static website generator, to use a JavaScript/CSS library on a specific page.


