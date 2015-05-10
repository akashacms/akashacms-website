---
layout: article.html.ejs
title: CSS and JavaScript files for AkashaCMS websites
rightsidebar:
publicationDate: May 9, 2015
author: david
---

CSS and JavaScript files are what made the modern website what it is.  Otherwise we'd be stuck with plain browser-default HTML, but retaining visitors is in part making your site presentable or even beautiful.  AkashaCMS strives to be at the cutting edge of HTML5, CSS3 and JavaScript techniques for that purpose.

Adding CSS and JavaScript to HTML is performed by the `akashacms-base` plugin, and starts with this code in `config.js`

```
headerScripts: {
    stylesheets: [ ],
    javaScriptTop: [ ],
    javaScriptBottom: [ ]
},
```

This object contains a list of CSS and JavaScript files inserted into the HTML of every page on the website or eBook.  Each page can also declare CSS and JavaScript files, to support customization of individual pages.

The actual process is handled by these tags and partials:

<table width="100%" border="1">
<tr><th>Tag Name</th><th>Partial</th><th>Discussion</th></tr>
<tr><td>ak-stylesheets</td><td>ak_stylesheets.html.ejs</td><td>Puts CSS file links in the &lt;head&gt; section</td></tr>
<tr><td>ak-headerJavaScript</td><td>ak_javaScript.html.ejs</td><td> Puts JavaScript links in the &lt;head&gt; section</td></tr>
<tr><td>ak-footerJavaScript</td><td>ak_javaScript.html.ejs</td><td> Puts JavaScript links at the bottom of the &lt;body&gt;</td></tr>
</table>

The data for these tags comes from the `headerScripts` object mentioned earlier.  

For example:

```
headerScripts: {
    stylesheets: [
        { href: "/style.css", media: "screen" }
    ],
    javaScriptTop: [
        { href: "/js/main.js" }
    ],
    javaScriptBottom: [
        { href: "/js/infooter.js" }
    ]
},
```

The `href` attribute gives the reference, whether internal to the site or from an external site, for the relavent files.  

For example if you always want to include jQuery and some custom JavaScript:

```
headerScripts: {
    stylesheets: [
        { href: "/style.css", media: "screen" }
    ],
    javaScriptTop: [
    ],
    javaScriptBottom: [
        { href: "//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js" },
        { href: "/js/site.js" }
    ]
},
```

What we have here are Array's containing descriptions of CSS and JavaScript HTML elements.  The starting point for the array is the `headerScripts` object in the `config.js` file, and as we see below Plugin's can add elements to these array's for site-wide CSS and JavaScript files, and individual pages can add per-page-specific elements to these array's.

The items listed in `stylesheets` obviously become 

```
<link rel="stylesheet" href="..." type="text/css" media="..."/>
```

And the items listed in `javaScriptTop` and `javaScriptBottom` obviously become

```
<script src="..."/>
```

When AkashaCMS is used to produce electronic books (see [](/plugins/epub.html)) these examples have to be a little different.  The rules for EPUB say there is no "container" and hence a URL path starting with '/' is not allowed.  Instead, the `href` values have to be relative paths from the referencing file to the referenced file.  Further, EPUB's cannot reference external script files, meaning every CSS and JavaScript file has to be contained in the EPUB package.

## Plugins adding their own CSS and JavaScript files

It's expected many plugins will want to add their own CSS and JavaScript files.  They're to do this when the plugin `config` function is called.

It's important to ensure the scripts finish in the correct order in the HTML.  For example, jQuery has to be loaded before any JavaScript files which use jQuery functions.

The `akashacms-boilerplate` plugin offers a great example of what to do:

```
config.headerScripts.stylesheets.unshift({
	href: config.themeBootstrap.bootstrapCSSurl
        ? config.themeBootstrap.bootstrapCSSurl
        : "/bootstrap3/css/bootstrap.min.css",
	/* media: "screen" */
});
config.headerScripts.stylesheets.unshift({
	href: config.themeBootstrap.bootstrapThemeCSSurl
        ? config.themeBootstrap.bootstrapThemeCSSurl
        : "/bootstrap3/css/bootstrap-theme.min.css",
	/* media: "screen" */
});

config.headerScripts.javaScriptBottom.unshift({
	href: config.themeBootstrap.bootstrapJSurl
        ? config.themeBootstrap.bootstrapJSurl
        : "/bootstrap3/js/bootstrap.min.js"
});
config.headerScripts.javaScriptBottom.unshift({
	href: config.themeBootstrap.jQueryUrl
        ? config.themeBootstrap.jQueryUrl
        : "//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"
});
```

This code also allows the website to override the default URL's for Boilerplate CSS and JavaScript files.  Such as:

```
themeBootstrap: {
	bootstrapCSSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css",
	bootstrapThemeCSSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css",
	bootstrapJSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js",
	useHtml5shiv: true,
	useRespondJS: true
},
```

## Per-page CSS and JavaScript files

As we said earlier each page can also add CSS and JavaScript files to the mix.  It's done in the document metadata like so:

```
headerStylesheetsAdd: 
  - href: /extra.css
    media: screen
headerJavaScriptAddTop:
  - href: /extraTop.js
headerJavaScriptAddBottom:
  - href: /extraBottom.js
```

The document metadata is in YAML format.  The way YAML declares a series of objects is with indented lines like this.  The line containing a '-' character marks the beginning of a list item, and item fields are the `tag: value` pairs shown here.  The list elements obviously must correspond directly to the object descriptions we just gave.

The scripts listed this way are evaluated in addition to the ones in the `headerScripts` object, and will appear in the HTML files after items in `headerScripts`.

It is possible to put these into a layout file, in-case you want to use the same scripts on multiple pages.  Simply define a `layouts` like `page-with-scripts.html.ejs`, then in the document metadata use that `layout` file.

If you want to specify more than one of each, do it this way:

```
headerStylesheetsAdd: 
  - href: /extra1.css
    media: screen
  - href: /extra2.css
    media: screen
headerJavaScriptAddTop:
  - href: /extraTop1.js
  - href: /extraTop2.js
headerJavaScriptAddBottom:
  - href: /extraBottom1.js
  - href: /extraBottom2.js
```





