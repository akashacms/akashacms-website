---
layout: blog.html.njk
title: Looking forward to AkashaCMS 0.5.x work
publicationDate: Feb 11, 2015 12:00 PDT
blogtag: news
teaser: Now that AkashaCMS is reaching its 0.4.x milestone, what am I thinking of for the 0.5.x release
---

The work in AkashaCMS 0.4.x represented a large amount of change and its capabilities are well beyond what 0.3.x could do.  The primary changes were:

* In-browser editor to try and simplify editing an AkashaCMS site.  It's somewhat useful, but will probably be rewritten
* Introduction of Mahabhuta engine to bring jQuery style DOM manipulation.  This enabled many powerful filters and custom tags.  It means an AkashaCMS programmer can re-use their jQuery knowledge for server-side DOM manipulation.
* Simplified rendering model

For the 0.5.x release, my thoughts at the moment are

* Implement more of an AkashaCMS server to enable more client applications - such as mobile apps?
* Rewrite the `akasha.process` functionality to use Grunt or Gulp or Orchestrate to disentangle the steps.  It seems attractive to integrate AkashaCMS rendering with the various grunt or gulp tools.  For example, AkashaCMS has a minimize function that's disemboweled right now, and there is a need for AkashaCMS sites to be minimized.  Does it make sense for AkashaCMS to implement the minimize function when grunt or gulp already has excellent support?
* Similarly, maybe AkashaCMS can be re-envisioned as a grunt or gulp plugin?
* Integrating semantic web and microformat markup into something.  Google has made it clear that's the future, and since AkashaCMS wants to stay on the cutting edge it needs to integrate this stuff.
* Rewrite the in-browser editor, with a proper UI toolkit.  I've now done two versions of the in-browser editor, and am still editing my sites with a text editor.  The current editor is better than the first version, but it's still not right.

The [release of AkashaCMS 0.3.x](http://davidherron.com/blog/2014-04-26/akashacms-v030-released-major-rearchitecting-plugins-improvements-much-more-planned) was about 9 months ago.  Who knows how long the 0.5.x release will take.  I see from my aspirations at that time, that I implemented most of the hoped-for items, and a whole lot more.

The remaining bits from that list -- merge/minify and rebuilding only what's necessary -- might, as I just said, be better done via the grunt or gulp ecosystem than reimplementing it on my own.

At the same time, the vision now is much bigger, now that I've been working on the in-browser editing support.  For example, in the past I've gone to events and made blog posts at the event.  The blog in question was hosted by Blogger, and while it's a decent blogging platform I'm pondering the transfer of those blogs to AkashaCMS.  A question that comes up is the capability to write blog posts while mobile.  Hence - a mobile app with a decent server over a REST API is the ticket.
