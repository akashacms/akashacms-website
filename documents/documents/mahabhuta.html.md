---
layout: article.html.ejs
title: The Mahabhuta templating engine for AkashaCMS
rightsidebar:
publDate: May 26, 2014
---

The Mahabhuta engine allows website authors to perform jQuery DOM manipulations on the server side.  Reusing your jQuery knowledge may be a good thing, we hope.  Let the concept sink in for a moment, because this can be powerful.

The name?  "Mahabhuta" is the Sanskrit name for the five elements, with Akasha being one of those elements.  The Mahabhuta engine deals with HTML Elements, so it seems like a fitting name.

Mahabhuta processing occurs at the `xyzzy.html` or `xyzzy.php` stage of processing documents.  It hasn't been verified whether the jQuery engine being used works on PHP code.  In any case it means Mahabhuta runs as the last step, after all the HTML has been generated for the page.

Before we get to the jQuery code, we need to look at where we put the code.

As for other parts of AkashaCMS, we want to let plugins use jQuery functions, as well as the website.

The jQuery code is written in functions that are stored in a `config.js` array, named `mahabhuta`.  Simply add this to `config.js`:

```
    mahabhuta: [ ],
```

The `mahabhuta` array will store a list of functions.  The website can add its own function like so:

```
    mahabhuta: [
        function(config, $, metadata, done) {
            ... jQuery code
        }
    ]
```

A plugin is supposed to add functions to this array like so:

```
module.exports.config = function(akasha, config) {
    ...
    if (config.mahabhuta) {
        config.mahabhuta.push(function(config, $, metadata, done) {
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
      function(config, $, metadata, done) {
          $('hello-world').replaceWith('<p class="hello-world">Hello world! '+ metadata.title +'</p>');
          done();
      }
    ],
```

This piece looks for a tag named `hello-world` and replaces it with the HTML snippet.  You probably want to use an EJS based partial instead.  NOTE: We haven't implemented the capability yet, and it looks like the API will have to change.

It's required to call `done()` when the function is done, and if there's an error to indicate it by calling `done(err)`.  This means the function can do asynchronous code execution.  Only one Mahabhuta function will execute at a time.

The jQuery functionality is the subset implemented by the Cheerio module (see https://www.npmjs.org/package/cheerio).  Cheerio has its own implementation of the jQuery API, and the authors give their rationale on the project page.  What's available is the portion of jQuery which makes sense on the server.  It does not use JSDOM under the covers, for speed and for more liberal HTML parsing.

