---
layout: layoutarticle.html.ejs
title: Partials in AkashaCMS
---



The partials concept uses the same [frontmatter/content format](content.html) you're already familiar with, but is interpolated separately from the [layouts](layouts.html) template chain.  Partials are pulled into the template rendering using the `partial` function.  An example is

    <%- partial('helloworld.html') %>
    
    <%- partial('listrender.html.ejs',
        {
            items: {
                "item 1": "item text 1",
                "item 2": "item text 2",
                "item 3": "item text 3",
                "item 4": "item text 4"
            }
        })
    %>

The named template is searched for under the `root_partials` directory, then rendered and inserted into the template being processed.  Data can be passed to the partial template.  No `content` variable is available.