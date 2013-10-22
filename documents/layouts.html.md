---
layout: layoutarticle.html.ejs
title: Page layout in AkashaCMS
---

Much of AkashaCMS's power comes from the flexible templating and page layout system, as well as the [partials](/partials.html) support.  The system supports several templating systems, "partials" (mini templates into which you can pass data), and chaining to parent templates.

The [overall format for content and layout files](content.html) supports a usefully flexible metadata block at the front of the content file.  One of the metadata items is the [page layout](layout.html) with which to render the content.

Declaring the template for a content file
=========================================

The template is simply declared using the `layout` tag in the frontmatter like so:

    ---
    layout: article.html.ejs
    other: frontmatter
    ---
    <p>Content</p>

The rendered content is available in the template in the `content` variable.  For example, if the EJS template engine is used the content is to be referenced like so:-

    <%- content %>

Note that `<%- .. %>` is used to not interpret the content, but just copy it in straight.  This is an important distinction, because the rendering will already be in HTML format and if `<%= .. %>` were to be used, the HTML code would be converted to HTML entitity codes.

The content gets rendered into its template wherever the `content` variable is referenced, as just said.

