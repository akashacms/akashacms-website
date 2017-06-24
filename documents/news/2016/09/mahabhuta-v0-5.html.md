---
layout: blog.html.ejs
title: Major upgrade to Mahabhuta, the server-side DOM processing engine in AkashaCMS
publicationDate: September 15, 2016
blogtag: news
teaser: Mahabhuta can now, with its version 0.5 release, emerge from the shadows of AkashaCMS and serve a useful purpose in its own right.  DOM processing in the style of jQuery is now possible in Node.js server applications.  The update makes it more feasible to integrate Mahabhuta into applications other than AkashaCMS, including integration into Express applications.
---

A key cool feature of AkashaCMS/AkashaRender is that one can easily develop custom HTML elements that expand to HTML of your design.  This feature is actually enabled by Mahabhuta, which makes it easy to use Cheerio (the jQuery-alike library for Node.js) to do HTML DOM processing.  The system is extremely flexible, attested to by the large body of AkashaCMS plugins and the Mahabhuta functions driving those plugins.

Since Mahabhuta is a small library you might think it a simple thin wrapper around Cheerio, so what's the big deal?  Cheerio does the hard work of implementing parts of the jQuery API, after all.  Mahabhuta's design supports implementing any number of independent "Mahafuncs" and organizing them into arrays for execution.  You can easily organize groups of Mahafunc's providing related functions, then string together several of those groups in your application.

There are two principle types of Mahafunc's

* _CustomElement_ -- Processes a single HTML element like `<hello-world/>`, performs some processing (which can involve asynchronous calls to backend services), replacing it with a result like "Hello, world!".
* _Munger_ -- Allows arbitrary jQuery-like DOM manipulation of the page.

The AkashaCMS/AkashaRender plugins contain dozens of these functions.  For example `akashacms-embeddables` provides many Mahafunc's for embedding things like 3rd party video from services like YouTube or Vimeo.  The `<framed-youtube-player>` calls the YouTube API to retrieve information required to nicely embed a YouTube video.  The `<framed-embed>` element instead uses the OEmbed protocol to serve a similar purpose.  Another example is scanning for internal links and doing some nice things like adding `title=` attributes, or if the link has no text to substitute the title of the target page.  For external links it's possible to add `rel="nofollow"` to links to selected sites.

With version 0.5 Mahabhuta contains several new features.  The CustomElement and Munger classes for example make it easier to write Mahabhuta functions, by abstracting away some of the boilerplate.  Another class, MahafuncArray, organizes the arrays of these functions more cleverly.

Provided along with Mahabhuta is a group of "built-in" Mahafunc's.  These are the first Mahafunc's that can run independently of AkashaCMS/AkashaRender.  The most important of these is the `<partial>` tag which pulls in content snippets making it easier to render pages.

There is a small eBook in the Mahabhuta repository explaining how to use it.

There are two examples of using Mahabhuta including a small Express application.  By following the outline in that Express app, you can easily DOM-process the HTML in your Express app before sending it to the client.

# The complete rewrite of AkashaCMS ==> akashaRender

This year I've undertaken to completely rewrite AkashaCMS and the result is now called AkashaRender.  I think that name will stick.

I had grown increasingly uneasy with the AkashaCMS internal architecture.  The advent of Node.js 4.0 and ECMAScript-2015 features like Promise's gave me a reason to learn the fine art of Promise chains.  To do so I began writing code very similar to AkashaCMS but based on the Promise object, rather than on callbacks.  Starting from scratch meant the opportunity to develop a new internal architecture based on the lessons of the AkashaCMS architecture.

AkashaRender relies heavily on ES-2015 Class's to organize code and functionality.  It's making the code more modular and cleaner.

I haven't had time to clean up the AkashaRender work to publish on the npm repository.  Instead most of the work is happening in the `#akasharender` branch of the various AkashaCMS plugins, and in the `akasharender` repository.  

Over the next few months I'll figure out how to publish all this.  The `akashacms` packages will surely become deprecated at that time.

It does mean most of the documentation on this site is stale.
