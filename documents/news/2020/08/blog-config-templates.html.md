---
layout: blog.html.njk
title: Correctly configuring the AkashaCMS blog-podcast plugin for multiple layout templates
publicationDate: August 9, 2020
blogtag: news
teaser: |
    In AkashaCMS, the blog-podcast module determines which files are included in a given blog by the layout templates.  The layout template turns out to be a useful way of determining the kind of document for each file.  In other words, a blog post would use the <tt>blog.html.ejs</tt> layout template.  That assumption works until you start implementing other layout templates, which I've done on the AkashaCMS news blog to correspond to adopting Liquid and Nunjucks templates.
---

Being a good project owner, I use the AkashaCMS website source code to demonstrate how to use AkashaCMS.  For that purpose, having implemented both Liquid and Nunjucks template engines, I implemented `blog.html.liquid` and `blog.html.njk` layout templates, then set a bunch of the blog posts to use those templates.

Unfortunately that blew up, with the blog-podcast plugin printing errors about _did not find document ... in blog_.  That had me scratching my head for awhile until it dawned on me that the declaration for the blog specified the `blog.html.ejs` template, so changing the blog posts to use other templates made them no longer part of the blog.

To explain let's look at the configuration for the blog containing this post:

```javascript
news: {
    rss: {
        title: "AkashaCMS News",
        description: "Announcements and news about the AkashaCMS content management system",
        site_url: "http://akashacms.com/news/index.html",
        image_url: "http://akashacms.com/logo.gif",
        managingEditor: 'David Herron',
        webMaster: 'David Herron',
        copyright: '2015 David Herron',
        language: 'en',
        categories: [ "Node.js", "Content Management System", "HTML5", "Static website generator" ]
    },
    rssurl: "/news/rss.xml",
    rootPath: "news",
    matchers: {
        layouts: [ "blog.html.ejs" ],
        path: /^news\//
    }
},
```

Most of this is fields for the RSS feed, describing the blog.  The `matchers` field is where we tell the blog-podcast plugin how to select posts for this blog.  The `layouts` matcher gives a list of layout templates to match.  Notice that it says `blog.html.ejs`.

So... if a blog post has this layout:

```yaml
layout: blog.html.njk
```

It will not be matched by the matcher, and therefore not be part of the blog.

The fix is simple:

```javascript
layouts: [ "blog.html.ejs", "blog.html.liquid", "blog.html.njk" ],
```

Simply add the new templates to the layout matchers.

