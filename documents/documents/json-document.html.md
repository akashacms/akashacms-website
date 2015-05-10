---
layout: article.html.ejs
title: JSON Document Files in AkashaCMS 
rightsidebar:
publicationDate: May 9, 2015
author: david
---

It may be useful for some documents, rather than use a recognized text format (like HTML or Markdown) to use a data format.  That is, take some data, formatting it through a template, to make a web page.  To that end, AkashaCMS supports JSON documents that can be processed through the AkashaCMS rendering system and producing HTML.

For example, this file named `json-data.html.json` ([from akashacms-example](https://github.com/akashacms/akashacms-example/blob/master/documents/json-data.html.json))

```
---
layout: default.html.ejs
title: JSON example
JSONFormatter: json-format.html.ejs
---
{
    "Row1": "value 1",
    "Row2": "value 2",
    "Row3": "value 3"
}
```

This is a fairly normal AkashaCMS document, but the body is JSON.

The JSON RenderChain triggers on file names ending in `.html.json`.  It parses the content body as JSON, passing it as a variable named `data` to the partial named in `JSONFormatter`.

The named partial used here is [json-format.html.ejs](https://github.com/akashacms/akashacms-example/blob/master/partials/json-format.html.ejs), or

```
<%
var keys = Object.keys(data);
for (var i = 0; i < keys.length; i++) {
    var datum = data[keys[i]];
    %>
    <p>
    <%= keys[i] %> :- <%= datum %>
    </p>
    <%
} %>
```

With this data it produces

```
<p>
Row1 :- value 1
</p>

<p>
Row2 :- value 2
</p>

<p>
Row3 :- value 3
</p>
```

This example shows the steps.

* JSON data
* Format that data using a partial into HTML
* That HTML used as input to the AkashaCMS rendering to produce the final page

