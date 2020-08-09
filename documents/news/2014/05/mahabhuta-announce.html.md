---
layout: blog.html.njk
title: Major change in AkashaCMS - new model for rendering content, and jQuery as a template engine
publicationDate: 2014-05-27 14:47
blogtag: news
teaser: |
    I'm about to release an AkashaCMS v0.3.x update that represents a major rewrite of the rendering system, and the addition of support to use the jQuery API on the server side to manipulate rendered pages. Both of the changes are major, and take AkashaCMS to a new level of flexibility. First, Website authors will be able to use any combination of template engine on each page, giving better flexibility over page formatting. Second, the capability to use server-side jQuery calls means a different approach to inserting content into the page (versus traditional templates) plus we can implement filters to make broad-based content tweaks.
---
The code has been checked into the AkashaCMS github repository but has not been released to the NPM repository, yet. I want to do some testing beforehand. Also, because the change is being introduced early in the v0.3.x cycle, it'll have plenty of time to bake before I release AkashaCMS v0.4.x.

# Document file-names and rendering pipelines

Until now AkashaCMS documents had a fairly rigid file name structure. The file name extensions documented the order of processing through the template engines but the allowed set of rendering pipelines was rigid. Turns out the code was way more complex than it needed to be, as well.

Today the file name format is: `xyzzy.{html,php}.{ejs,md,kernel}``

That is, it either produces `xyzzy.html` or `xyzzy.php`, and processes it with `ejs`, `markdown` or `Kernel` beforehand. What if you want to process with two rendering engines? (Markdown and EJS for example)

With this change you'll be free to use any number of template engine extensions, in any order:

* `xyzzy.html` - only processed with Mahabhuta (see below)
* `xyzzy.html.md.ejs` - Process first with EJS, then with Markdown, then with Mahabhuta
* `xyzzy.php.md.md.md.kernel` - Process first with Kernel, then with Markdown (note, the software lets you specify the same engine multiple times, in any order), then produce xyzzy.php

In short, you can string any order of extensions you like, and as a side effect you CAN specify the same template engine extension multiple times. That may be a bug, I don't know yet.

# Introducing Mahabhuta - the jQuery API based template system

I mentioned Mahabhuta - first obvious question is about the name. Mahabhuta is the Sanskrit name for the five elements, one of which is Akasha. The Mahabhuta engine lets you use the jQuery API to manipulate HTML elements. I figure, elements are elements, hence it's called Mahabhuta.

This is built upon the Cheerio module, that implements a subset of the jQuery API but is tons faster and has a very forgiving HTML parser.

Website authors, and AkashaCMS plugin authors, will be able to write callback functions which are given a '$' function that does what you expect - call jQuery functions to manipulate the DOM of rendered pages. The callback functions are called at the end of the rendering process, before the file is written to the output directory.

It means you'll be able to do any (almost) DOM manipulation that jQuery code can do. On the server side, before it's sent to the browser. Specifically, at the time AkashaCMS renders the HTML, meaning this is not dynamic jQuery-on-the-server (on every page view) but a one-time use of jQuery when the page is rendered.

The jQuery API is very powerful at manipulating and rewriting HTML, of course, and it's very familiar technology to almost everyone developing websites. This should be a big improvement to AkashaCMS.

# Summary

These are exciting changes that should make AkashaCMS even more powerful than it is. They aren't yet published in the NPM package because I want to do a bit more testing and code cleanup.

When it's ready, I'll post another announcement. Keep an eye peeled on the AkashaCMS (link is external) website.
