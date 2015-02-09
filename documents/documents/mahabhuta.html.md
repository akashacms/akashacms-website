---
layout: article.html.ejs
title: The Mahabhuta templating engine for AkashaCMS
rightsidebar:
publDate: Jan 2, 2015
author: david
---
The Mahabhuta engine allows website authors to perform jQuery DOM manipulations on the server side.  Reusing your jQuery knowledge may be a good thing, we hope.  Mahbhuta will make it possible to reuse jQuery knowledge to reorganize, rewrite, or otherwise manipulate pages on the server side.  Let the concept sink in for a moment, because this can be powerful.

The name?  "Mahabhuta" is the Sanskrit name for the five elements, with Akasha being one of those elements.  The Mahabhuta engine deals with HTML Elements, so it seems like a fitting name.

## Overview

Mahabhuta processing occurs several times while processing documents.  It hasn't been verified whether the jQuery engine being used works on PHP code.  In any case, the Mahabhuta functions are run multiple times because one function might leave special tags in the content meant to be processed by other Mahabhuta functions.

The jQuery library is of course very powerful, and it can be used for pretty much any HTML manipulation.  We are not using the official jQuery library, but instead a jQuery clone called Cheerio.  It provides a subset of jQuery functions which make sense for non-browser environments.  Because Cheerio doesn't support every jQuery operation, we occasionally have to get inventive with workarounds.

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

If you don't create the `mahabhuta` array it will be created for you.  The `mahabhuta` array stores a list of functions, each of which we call a `mahafunc`.  The Mahabhuta engine iterates through this array, executing each mahafunc.

The website can add its own mahafunc's like so:

```
mahabhuta: [
    function($, metadata, dirty, done) {
        ... jQuery code
        ... When it's all finished
        done();
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
module.exports.mahabhuta = [
    
    function($, metadata, dirty, done) {
        ... jQuery code
    });
    ...
}
```

When the plugin is registered with AkashaCMS, the content of this array is copied over to `config.mahabhuta`.

The order of the functions in `config.mahabhuta` will reflect the order the plugins are listed in the `config.plugins` array.  This can be important if you end up with two functions working on the same tag.

# Coding Mahabhuta functions

A _mahafunc_ (Mahabhuta function) has the signature: `function($, metadata, dirty, done)`

The `$` parameter is what you expect, the object with which to call jQuery functions.

The `metadata` parameter is derived from the frontmatter metadata, plus a few other bits of data.  For example, layout files can add data to the metadata as they are processed.

The `dirty` parameter is a function that should be called if the processing made the document "dirty" meaning it needs at least one additional stage of processing.  For example, a Mahabhuta function can insert a special tag into the content that has to be processed by another Mahabhuta function.  Calling the `dirty` function informs Mahabhuta it has to run the function list at least one more time.

The `done` parameter is a function to call when this mahafunc is finished.  It has the expected signature of: `done(err)`.

A trivial example is this:

```
function($, metadata, dirty, done) {
    $('hello-world').replaceWith('<p class="hello-world">Hello world! '+ metadata.title +'</p>');
    done();
}
```

This piece looks for a tag named `hello-world` and replaces it with the HTML snippet.  It's preferable to use an EJS template which you can easily do by using the `akasha.partial` or `akasha.partialSync` function.

It's required to call `done()` when the function is done, and if there's an error to indicate it by calling `done(err)`.  This means the function can do asynchronous code execution.  Only one Mahabhuta function will execute at a time.

The jQuery functionality is the subset implemented by [the Cheerio module](https://www.npmjs.org/package/cheerio).  Cheerio has its own implementation of a subset of the jQuery API.  The Cheerio authors give their rationale for not implementing the entire jQuery API on the project page.  What's important for us is that because it doesn't use JSDOM under the covers, Cheerio is faster and more liberal parsing HTML.

Asynchronous processing can be done in a Mahabhuta function, if special care is taken to ensure `done` is called when every last erg of asynchronicity has been accomplished.

For example, this is a fairly straightforward example of synchronous jQuery processing.

```
config.mahabhuta.push(function($, metadata, dirty, done) {
    var href, width, height;
    // <googledocs-viewer href="..." />
    $('googledocs-viewer').each(function(i, elem) {
        href = $(this).attr("href");
        if (!href) done(new Error("URL required for googledocs-viewer"));
        else {
        	$(this).replaceWith(
				akasha.partialSync("google-doc-viewer.html.ejs", {
					docViewerUrl: generateGoogleDocViewerUrl(href)
				})
        	);
        }
    });
    done();
});
```

There is a problem with this code snippet however.  Suppose there is more than one `googledocs-viewer` tags on a page, and one triggers the error detected in the middle.  In such a case the `done` function will be called multiple times when it should only be called once.

While the jQuery `.each` function looks like it's asynchronous, it isn't.

This code pattern is preferred because it ensures `done` is called only once, while accommodating multiple instances of a tag, and the potential for error in any of them.

```
config.mahabhuta.push(function($, metadata, dirty, done) {
	logger.trace('publication-date');
	var elements = [];
	$('publication-date').each(function(i, elem) { elements.push(elem); });
	async.eachSeries(elements,
	function(element, next) {
		logger.trace(metadata.publicationDate);
		if (metadata.publicationDate) {
			akasha.partial("ak_publdate.html.ejs", {
					publicationDate: metadata.publicationDate
				},
				function(err, html) {
					if (err) { logger.error(err); next(err); } 
					else { $(element).replaceWith(html); next(); }
				});
		} else next();
	}, function(err) {
		if (err) { logger.error(err); done(err); } 
		else { logger.trace('END publication-date'); done(); }
	});
});
```

The first step is to collect references to each tag processed by the function (`publication-date` in this case).

Then we use `async.eachSeries` to process the instances, one at a time.  Each instance is rendered using the `akasha.partial` function, which itself is an asynchronous function.  All possible branches are coded to call the `next` function with appropriate parameters, ensuring the final stage of the `async.eachSeries` is entered only once and with values appropriate to whether or not there was an error.

By calling `.replaceWith` we ensure the tag which triggered this code is removed from the content.  The mahafunc's have to be written with the knowledge they'll be invoked multiple times.  They should not repeatedly perform the same manipulation each time, but should instead ensure the manipulation is done only once.  Using `.replaceWith` is a cheap way to ensure the tag won't be processed more than once.