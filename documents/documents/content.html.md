---
layout: article.html.ejs
title: Overall format for content files
rightsidebar:
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

The content area must be formatted as defined by the filename extension.  See [file names & extensions](extensions.html) for more information.

If the content file specifies a template, the content is passed to that template in the variable named `content`.
