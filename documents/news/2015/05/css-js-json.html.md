---
layout: blog.html.ejs
title: Pages can be JSON data, and can declare CSS and JS files
publicationDate: May 9, 2015
blogtag: news
teaser: Pages can now be written as JSON data, that's formatted through a partial into HTML.  Pages can now declare their own CSS or JavaScript files.
---

These were two long-standing wish-list items that were just implemented.  While not ground-breaking, each of these items fill in base-line useful features.

## JSON formated content documents

The idea is that sometimes we want to supply some data, rather than normal content, to format as a webpage.  The first go-around of this idea is to support JSON data.

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

As you see, the content body is straight-up JSON.  The JSON is immediately processed by the partial named in `JSONFormatter` to produce HTML that's then rendered as a page through the normal AkashaCMS process.

See [](/akasharender/3-create-content.html)

## Per-page CSS and JavaScript

It's often desirable to put custom CSS and JavaScript on a page.  That's now very easy, with the following document metadata instructions:

```
headerStylesheetsAdd:
  - href: /extra.css
    media: screen
headerJavaScriptAddTop:
  - href: /extraTop.js
headerJavaScriptAddBottom:
  - href: /extraBottom.js
```

See [](/akasharender/3-create-content.html)
