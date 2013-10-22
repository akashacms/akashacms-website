---
layout: article.html.ejs
title: Writing content in AkashaCMS 
rightsidebar:
---

Content files in AkashaCMS follow a fairly simple format that serves two purposes

* Metadata that can be used by code in templates, and declares the page layout to use
* Content that's made available in the `content` variable

It is the files under directories named in the `root_docs` variable that are treated as content files.

Overall format for content files
================================

Content files are split into two sections matching the two purposes named above.  The metadata is in the front of the file, and is called "frontmatter".  The content area follows the frontmatter.

    ---
    tag: value
    layout: article.html.ejs
    frontmatter: tag:value pairs between ---'d lines
    ---
    <p>This is the content area.</p>
    
The frontmatter follows a simple `tag:value` format.  You can use any tag's desired and most of the tags are not interpreted by AkashaCMS.  The tags, and their values, are made available as variables to templates.

The predefined tags are:-

* `layout` - Specifies the layout template to use for rendering the page.  See [Layouts](layouts.html) for more information.

The [AkashaCMS example](https://github.com/robogeek/akashacms-example) contains layouts with an extensive set of HTML, OpenGraph or Twitter Card meta tags.  The values for these tags come from frontmatter tags.

The content area must be formatted as defined by the filename extension.  See [File names](extensions.html) for more information.

If the content file specifies a template, the content is passed to that template in the variable named `content`.

