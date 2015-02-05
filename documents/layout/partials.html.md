---
layout: article.html.ejs
title: Partials in AkashaCMS
rightsidebar:
publicationDate: Jan 1, 2015
author: david
---
Partials are little snippets of template, which can be rendered into any location of any template using the `partial` tag.  An example is

    <partial file-name='helloworld.html'></partial>

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

Using the tag form of `partial` you provide arguments this way:

    <partial file-name="render-data.html.ejs"
             data-title="Some title text"
             data-some-long-attribute-name="attribute value">
        {
            items: {
                "item 1": "item text 1",
                "item 2": "item text 2",
                "item 3": "item text 3",
                "item 4": "item text 4"
            }
        }
    </partial>

All the attributes whose name starts with `data-` are collected and made available as variables in the template.  A long attribute name like shown above is translated into a camelCase variable name like `someLongAttributeName`.  The body text appears as the template variable named `partialBody`.  

The named partial template is searched for in the directories named in the `root_partials` array.  The partial is rendered and inserted into the template being processed.  Data can be passed to the partial template, as shown above.  No `content` variable is available.

The file named in the partial can be a simple file, `<partial file-name="disqus.html">` in which case no processing is available and no data values get processed.  

# Partials and Mahabhuta

Partial processing doesn't directly invoke Mahabhuta.  However, the content of the partial will be integrated into the document being rendered.  Mahabhuta will eventually process everything provided by the partial.