---
layout: article.html.ejs
title: Announcing the Blog & Podcast plugin
publicationDate: Feb 10, 2015
blogtag: news
teaser: They say every content management system becomes a blogging platform.  Whether or not that's true, it's just become true for AkashaCMS.  A new AkashaCMS plugin allows the creation of multiple blogs within an AkashaCMS website.
---

It seemed necessary to develop blogging support for AkashaCMS, so that AkashaCMS could host its own news and announcements feed.  Until now I'd been announcing things about AkashaCMS via [davidherron.com](http://davidherron.com/) which meant those announcements weren't correctly connected with the AkashaCMS website.  The code I recently developed for [evwow.com](http://evwow.com) gave a strong start on blogging support, so I decided to make Blogging one of the milestone issues for the AkashaCMS 0.4.x release.

A blog is just a website where there's an index of the content presented in reverse chronological order, and where a machine-friendly index is presented as an RSS file.

Yes, bloggers tend to add other doodads in their sidebars, and I'll get to those eventually.  But at its barest minimum a blog is a website where the main index is a river of news as I just described.  That's it.  There's nothing magical to it.

A few weeks ago, to support evwow.com, I did add a `generateRSS` method to AkashaCMS.  A teensy bit of tweaking was needed to make it support blogs.  Then with a bit more work, I adapted some code out of the evwow.com site to create a new AkashaCMS plugin - `akashacms-blog-podcast`.  The plugin is documented [elsewhere on this site](/plugins/blog-podcast.html).

At the moment the Podcast portion of this is aspirational.  A podcast is just a blog, with media entries in the RSS feed, and with audio (or video) players embedded on the website.  I haven't yet implemented that stuff, but it appears to simply require some custom elements in the RSS feed definition.

This blog post is meant to both test the akashacms-blog-podcast plugin, and to announce its existence.  If you see this publicly you'll know the plugin is working.  