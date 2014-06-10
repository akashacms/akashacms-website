---
layout: article.html.ejs
title: The Mahabhuta templating engine for AkashaCMS
rightsidebar:
publDate: May 26, 2014
---

The Mahabhuta engine allows website authors to perform jQuery DOM manipulations on the server side.  Reusing your jQuery knowledge may be a good thing, we hope.  Mahbhuta will make it possible to reuse jQuery knowledge to reorganize, rewrite, or otherwise manipulate pages on the server side.  Let the concept sink in for a moment, because this can be powerful.

The name?  "Mahabhuta" is the Sanskrit name for the five elements, with Akasha being one of those elements.  The Mahabhuta engine deals with HTML Elements, so it seems like a fitting name.

## Overview

Mahabhuta processing occurs at the `xyzzy.html` or `xyzzy.php` stage of processing documents.  It hasn't been verified whether the jQuery engine being used works on PHP code.  In any case it means Mahabhuta runs as the last step, after all the HTML has been generated for the page.

That is, given a page `xyzzy.html.md.ejs`, AkashaCMS will process it first with EJS, then with Markdown, and end up with an HTML file.  The Mahabhuta stage then recieves that HTML, runs a bunch of jQuery manipulations on it, and then writes it to disk.

The jQuery library is of course very powerful, and it can be used for pretty much any HTML manipulation.  We are not using the official jQuery library, but instead a jQuery clone called Cheerio.  It provides a subset of jQuery functions which make sense for non-browser environments.

Here's a few ideas of what you can do with Mahabhuta

* Scan for custom tags - like &lt;youtube-viewer&gt; - and replace the tag with HTML tags - like the embed code for the video.
* Scan for an element for which you want to append other elements - such as appending visible anchors to H1/H2/H3 tags.
* Scan for any link to an external site, and append an icon informing the user it's an external link
* Scan for CSS or JavaScript files, merge/minify the files, replacing the tags with ones which refer to the merged CSS/JS files.

## Configuraton files

Before we get to the jQuery code, we need to look at where we put the code.

As for other parts of AkashaCMS, both the website and AkashaCMS plugins get to use Mahabhuta.

The jQuery code is written in functions that are stored in a `config.js` array, named `mahabhuta`.  Simply add this to `config.js`:

```
    mahabhuta: [ ],
```

The `mahabhuta` array will store a list of functions.  The website can add its own function like so:

```
    mahabhuta: [
        function(akasha, config, $, metadata, done) {
            ... jQuery code
        }
    ]
```

Additionally you can pass configuration options to Cheerio:

```
    cheerio: {
        recognizeSelfClosing: true,
        recognizeCDATA: true
    },
```

The `recognizeSelfClosing` option is important because it seems the HTML5 paradigm doesn't support self-closing tags.  

## Plugins

A plugin is supposed to add functions to this array like so:

```
module.exports.config = function(akasha, config) {
    ...
    if (config.mahabhuta) {
        config.mahabhuta.push(function(akasha, config, $, metadata, done) {
            ... jQuery code
        });
    }
    ...
}
```

The `$` parameter is what you expect, the object with which to call jQuery functions.

A trivial example is this:

```
    mahabhuta: [
      function(akasha, config, $, metadata, done) {
          $('hello-world').replaceWith('<p class="hello-world">Hello world! '+ metadata.title +'</p>');
          done();
      }
    ],
```

This piece looks for a tag named `hello-world` and replaces it with the HTML snippet.  It's preferable to use an EJS template which you can easily do by using the `akasha.partialSync` function.

It's required to call `done()` when the function is done, and if there's an error to indicate it by calling `done(err)`.  This means the function can do asynchronous code execution.  Only one Mahabhuta function will execute at a time.

The jQuery functionality is the subset implemented by [the Cheerio module](https://www.npmjs.org/package/cheerio).  Cheerio has its own implementation of the jQuery API, and the authors give their rationale on the project page.  What's available is the portion of jQuery which makes sense on the server.  It does not use JSDOM under the covers, for speed and for more liberal HTML parsing.

