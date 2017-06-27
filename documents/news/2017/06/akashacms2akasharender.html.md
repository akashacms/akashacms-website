---
layout: blog.html.ejs
title: Massive change, AkashaCMS is gone, replaced with AkashaRender
publicationDate: June 27, 2017
blogtag: news
teaser: |
    <p>A couple years ago I grew dissatisfied enough with the design of <em>akashacms</em>, the previous processing engine in AkashaCMS.  It was a powerful system, with it I built several large websites, wrote a book, and so forth.  But its inner structure had grown organically into a bit of a mess.  My pondering about what to do led me to implement a complete rewrite.  The new rendering engine, AkashaRender, is more flexible and is more sensibly organized.  It is also incompatible with the older system.</p>

    <p>Over the last week I have deprecated the old <em>akashacms</em>-based system, and have published updates to everything including the plugins and this website.  This blog post goes over what's happened.</p>
---

The good news is that while things have changed considerably, the content files are largely the same.  You may be able to reuse the content files unchanged.  I have several large websites implemented with AkashaCMS, and was able to move to the new AkashaRender-based system with almost no change to the files.

AkashaCMS versus AkashaRender is going to be a little confusing.  AkashaRender is the name of the rendering engine at the core of AkashaCMS.  The command for AkashaRender is `akasharender`.  That begs the question of exactly what AkashaCMS is.  Well, think of AkashaCMS as applying to the whole system, AkashaRender plus the AkashaCMS plugins, plus Mahabhuta.

The configuration file (`config.js`) is now completely different.  In the old system you assigned a big data object to `module.exports` and it was rather disorganized.  In the new system you make a Configuration object, call a bunch of methods on that object, and assign that to `module.exports`.  The result is not too dissimilar, but it makes a lot more sense and is better organized.  See [](/akasharender/configuration.html)

Project setup and lifecycle better uses the facilities offered by `npm`.  The old system had a command, `akashacms`, with every command built-in, making it hard to integrate a build system with other tools.  I wanted to add minification support, and had to add that to the `akashacms` command, which just didn't make any sense.  For awhile `grunt` seemed to be the way to go, but it's really not that good a system.  Then I there was the period when people started pushing for `npm` to be used as a build tool.  For small projects `npm` can serve as a passable build tool, and that's the preferred method with the new `akasharender` command.  See [](/akasharender/projects.html)

The internals of content rendering are far more sensible.  It's something you won't really see as a user of the system, but it makes the code easier to understand and maintain.  One big change is that the frontmatter is now a YAML object, giving a lot more power for content authors to describe metadata.

In general, the AkashaRender-based system adopts many of the new ES-2015/2016/2017 features including Classes and Promises and Generators.  Content rendering is handled by instances of the Renderer class.  It has several methods to handle content rendering.  One of these classes, HTMLRenderer, is a super-class for all Renderer's that produce HTML.  This is the class that does the magic of rendering content into a page layout, and running content through the Mahabhuta engine.

To read about creating content, see: [](/akasharender/3-create-content.html)

While Mahabhuta had been developed for the `akashacms` command, it received a major rewrite for AkashaRender.  Internally it uses Promises now, and the Mahafunc's are also implemented using JavaScript classes.  This is only important if you're going to write a plugin.  See [](/mahabhuta/toc.html)

Plugin creation is also object-oriented.  See [](/akasharender/plugins-writing.html)

Creating EPUB's with AkashaCMS was changed drastically back in 2015. ([](/news/2015/05/akashaepub-rewrite.html))  It didn't receive much change for the switch to AkashaRender.  However a new plugin, https://github.com/akashacms/epub-website, lets you use EPUB content on a website.  On akashacms.com we have three examples of sections that could down the world be formatted as EPUB's and are parts of the website.  The design intent is for the online version of this content to feel like an e-book reader.  See

* http://akashacms.com/akasharender/toc.html
* http://akashacms.com/mahabhuta/toc.html
* http://akashacms.com/epubtools/toc.html
