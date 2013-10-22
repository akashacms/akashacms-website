---
layout: layoutarticle.html.ejs
title: Template inheritance in AkashaCMS layouts
---

The file named in the `layout` tag can itself specify a layout.  Files in the `root_layouts` directory are formatted using the same [content](content.html) format used with content files.

The rendering (content rendered into its template) becomes the new `content` variable and is passed to the template listed in the `layout` variable.

This means you can easily build a chain of templates, piece-by-piece building up the whole page layout.  The content file specifies a layout, then each template can also specify a layout.  The template chain ends when a template does not specify a layout.

