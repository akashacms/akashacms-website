---
layout: article.html.ejs
title: Partials in AkashaCMS
rightsidebar:
---

The partials concept uses the same [frontmatter/content format](/documents/content.html) you're already familiar with, but is interpolated separately from the layouts template chain.  Partials are little snippets of template, which can be rendered into any location of any template using the `partial` function.  An example is

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
    
The named template is searched for in the directories named in the `root_partials` array.  The partial is rendered and inserted into the template being processed.  Data can be passed to the partial template, as shown above.  No `content` variable is available.

Sometimes you want to pass all the template variables into a partial.  In an EJS template or partial you can do this:

    <%- partial('partial-name.html.ejs', locals) %>

The variable, `locals`, is available in the context provided by EJS and contains all the template variables.