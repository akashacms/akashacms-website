---
layout: article.html.njk
title: About AkashaCMS - the powerful static file CMS to build your dream website
rightsidebar:
publicationDate: June 25, 2017
author: david
---
AkashaCMS was developed by myself, [David Herron](http://davidherron.com), in 2012 after a long period of pondering the value of dynamic CMS's like Drupal.  I have years of Drupal use, programming, and configuration, and can do quite fancy things with Drupal.  However, over time I realized that the overhead of maintaining Drupal was keeping me from doing the writing I had set out to do.  Further, that I needed a publishing system that would let me focus on publishing content, freeing me from maintenance chores.  Finally, I was turned off by the hosting overhead required to run a Drupal site.  

When I later built a couple sites with Wordpress, the experience only confirmed my opinions.

Most content management systems have a dynamic page generation system that, in its fullest expression, customizes each page to each viewer.  This is quite powerful because each visitor can have fully customized content.   My realization was that, for my sites, I saw little need for dynamic generation of each page on each page load.  My sites don't need that level of customization, and supporting that flexibility means a large server load.  I'd save a lot of money on server hosting costs by pre-rendering the website to static HTML.

In many sites the pages rarely change.  Why not generate the pages once, storing them as HTML on disk?  Such a site can easily be hosted on cheap low-end web hosting, without requiring an expensive VPS or other hosting solution.

A static HTML website might remind you of Dreamweaver or other WYSIWYG HTML editors.  Dreamweaver is a powerful piece of software, but my memory of using it is rigidity.  A big advantage of modern CMS's is flexibility (to a degree).  That is, you define a generalized page layout as a template, and then you separately write content, and the two come together to make the page that's shown to your visitors.

What about a static HTML website generator that follows the same model?  Each content page could declare which page template to use, and the page templates could refer to a shared code snippet library allowing for code reuse between page templates.  

That's what AkashaCMS does.  It gives you a flexible page generation system, and lots of support for the newest HTML5 and semantic web goodness.  You can easily add OpenGraph tags to the header, for example, and any JavaScript or CSS file is easily pulled in.  Partials support code reuse.  Further there is a powerful DOM processing engine using a jQuery-like API, allowing you to define custom tags (or use custom tags supplied by AkashaCMS plugins) that are rendered down to regular HTML for display.

*Purpose*: Seek a return to straight HTML files, while retaining the flexibility of modern CMS's and modern advanced JavaScript/CSS UI frameworks.

*Scope*: This is a system for producing a website full of HTML files.  The input content files can reference external data sources, just as dynamic CMS's do, etc.

*Maintainership*: At this time this is the work of myself, David Herron.  If you have ideas, fork one of the [AkashaCMS projects](https://github.com/akashacms), fix bugs or add features, then send a pull request.  Over time there might need to be an expansion into a more formal arrangement, but at the moment this will do.
