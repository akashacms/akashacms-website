---
layout: article.html.ejs
title: Partials in AkashaCMS
rightsidebar:
publicationDate: Jan 1, 2015
author: david
---
Partials are little snippets of template, which can be rendered into any location of any template using the `partial` tag.  An example is

    <partial file-name='helloworld.html'>

Additionally, in an EJS template you can do this.  The second argument is an object containing data to pass into the partial template.    

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
    
The named partial template is searched for in the directories named in the `root_partials` array.  The partial is rendered and inserted into the template being processed.  Data can be passed to the partial template, as shown above.  No `content` variable is available.

Sometimes you want to pass all the metadata variables into a partial.  In an EJS template or partial you can do this:

    <%- partial('partial-name.html.ejs', locals) %>

The variable, `locals`, is available in the context provided by EJS and contains all the template variables.

Passing arguments to the tag form is done using `data-` attributes:

    <partial file-name="template-name.html.ejs" data-data-value-1=".." data-value-2="..">

They will be available in the template as `dataValue1` and `value2`.

The file named in the partial can be a simple file, `<partial file-name="disqus.html">` in which case no processing is available and no data values get processed.  

# Partials and Mahabhuta

Partial processing doesn't directly invoke Mahabhuta.  However, the content of the partial will be integrated into the document being rendered.  Mahabhuta will eventually process everything provided by the partial.