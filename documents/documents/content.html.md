---
layout: article.html.ejs
title: Overall format for content files
rightsidebar:
publDate: Jan 1, 2015
author: david
---
Content files are split into two sections matching the two purposes named above.  The metadata is in the front of the file, is called "frontmatter", and is structured using the YAML format.    The content area follows the frontmatter.

    ---
    tag: value
    layout: article.html.ejs
    frontmatter: YAML formatted data between ---'d lines
    ---
    <p>This is the content area.</p>
    
You are free to use any tags desired in the frontmatter YAML.  Most of the metadata items are not interpreted by AkashaCMS.  Instead it's all available to templates or to Mahabhuta functions.

The predefined tags are:-

* `layout` - Specifies the layout template to use for rendering the page.  See [Layouts](/layout/index.html) for more information.
* `publicationDate` - Specifies the date to assocate with this content item.  When the site is rendered, both the `sitemap.xml` entry and the file times will be set to this value.  The format of the string is as defined by the JavaScript Date object - namely, the RFC 822 date string.  e.g. May 4, 2014 21:13 -0800

The content area must be formatted as defined by the filename extension.  See [file names & extensions](extensions.html) for more information.

If the content file specifies a template, the rendered content is passed to that template in the variable named `content`.