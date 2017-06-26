---
layout: article.html.ejs
title: Page layout in AkashaCMS
rightsidebar:
publicationDate: Jan 1, 2014
---
As we noted when discussing the [overall format for AkashaCMS files](/akasharender/3-create-content.html), documents are split into frontmatter and content.  Among the frontmatter tags is the `layout` tag which specifies the layout template for the content.

The template is simply declared using the `layout` tag in the frontmatter like so:

    ---
    layout: article.html.ejs
    other: frontmatter
    ---
    <p>Content</p>

The layout template is interpreted by the template engine implied by the [file extension](/akasharender/3-create-content.html), just as for partials and documents.

Rendered content is available in its' layout template in the `content` variable.  Therefore, somewhere in the template that variable must be accessed to render the content into the template.  The content is to be referenced like so:-

    <%- content %>

This gives us a separation between the content and the page layout.  Page layout is handled by the files in the `root_layouts` directories, while the content is provided by files in the `root_docs` directories.

# Chaining templates

The layout templates also support frontmatter to provide metadata.  The rendering system allows a layout template to specify its own `layout` tag, so that the result of rendering the template can be passed to another template.

Typically there will be a chain of templates which might be:

    article.html.ejs         // for "articles"
    default.html.ejs
    header-footer.html.ejs   // Provides the top and bottom parts of the page
    page.html.ejs            // Provides the HTML structure, including stylesheets, JavaScript and more

Each stage of the chain of templates should provide a bit of the page structure surrounding the main page content.

The final template, which we called `page.html.ejs` here, should be the destination of every template chain.  That way every page on the site will consistently carry the same HTML structure.

# Base themes and the page template

The [AkashaCMS-base plugin](/plugins/base/index.html), the [Bootstrap base theme](/plugins/theme-bootstrap/index.html)<!-- and the [Boilerplate base theme](/plugins/theme-boilerplate.html) --> all provide implementations of the `page.html.ejs`.  In each case the implementation supports a complete set of META tags, and flexible methods of bringing in stylesheets or JavaScript.
