---
layout: article.html.ejs
title: Overall format for content files
rightsidebar:
publDate: May 4, 2014
---


Content files are split into two sections matching the two purposes named above.  The metadata is in the front of the file, and is called "frontmatter".  The content area follows the frontmatter.

    ---
    tag: value
    layout: article.html.ejs
    frontmatter: tag:value pairs between ---'d lines
    ---
    <p>This is the content area.</p>
    
The frontmatter follows a simple `tag:value` format.  You can use any tag's desired and most of the tags are not interpreted by AkashaCMS.  The tags, and their values, are made available as variables to templates.

The predefined tags are:-

* `layout` - Specifies the layout template to use for rendering the page.  See [Layouts](/layout/index.html) for more information.
* `publDate` - Specifies the date to assocate with this content item.  When the site is rendered, both the `sitemap.xml` entry and the file times will be set to this value.  The format of the string is as defined by the JavaScript Date object - namely, the RFC 822 date string.  e.g. May 4, 2014 21:13 -0800

The content area must be formatted as defined by the filename extension.  See [file names & extensions](extensions.html) for more information.

If the content file specifies a template, the content is passed to that template in the variable named `content`.
