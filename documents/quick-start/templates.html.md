---
layout: getting-started.html.njk
title: Templates, Partials, Page Layout, and server-side DOM Manipulation
rightsidebar:
author: david
publicationDate: February 18, 2021
---

AkashaCMS supports your right to control every aspect of HTML pages you generate.  It even supports reconfiguring the system to produce XHTML, which is required for producing EPUB's using AkashaCMS.

Like most content management systems, our goal is simplifying your task of creating content for your website or e-Book.  But with most CMS's that ease of use gives you limited ability to control the HTML that's generated.  For example, in Wordpress it's possible to control every HTML tag, except doing so requires learning an arcane structure for writing templates and themes.

With AkashaCMS, the process is:

* Your create page layout templates from zero
* You control how many page layout templates are available
* Each content file declares which layout template to use
* Layout templates are simply HTML files
* Custom tags like `<embed-youtube>` and `<partial>` are available to flexibly extend the presentation - and you are able to override the templates associated with each

While we give you a lot of control, the system does not burden you with a lot of complexity.  Layout templates are easy to create, and the default templates used by custom tags are pretty good.

Earlier we [described several rendering engines](content.html) including some supporting EJS, Liquid, Handlebars and Nunjucks templating.  We also mentioned a module called Mahabhuta that allows us to create and use custom HTML tags.  In this section we'll cover both.

# Selecting a template engine

Out of the box AkashaRender supports several template engines.  In most cases it's easy to write a Renderer class to plug in any other template you desire, that's available as a Node.js module.

These are the engines supported currently:

Type | Extension | Description
-----|-----------|------------
EJS | `example.html.ejs` or `example.php.ejs` | for HTML, or PHP, with EJS markup, that produces HTML or PHP.
Liquid | `example.html.liquid` | For HTML, with Liquid markup, produces HTML
Nunjucks | `example.html.njk` | For HTML, with Nunjucks markup, produces HTML
Handlebars | `example.html.handlebars` | For HTML, with Handlebars markup, produces HTML

Notice that the engine is selected by the file extension.

We typically don't directly use the template engine.  Instead we typically write content with Markdown or AsciiDoc.  The template engines come into play with page layouts and partials, which we'll cover in later sections.

Each supported template engine has its own syntax for things like loops, or if/then/else blocks, and substituting variables into the output.  For details it's recommended to read the documentation for each engine.

# Page Layouts

Page layout templates control the formatting and layout of pages.  You can create as many page layout templates as you like, and each document declares which layout to use in the frontmatter.

Layout templates are stored in the directory you add using the `addLayoutsDir` method.

Content pages are rendered in a three-step process.

1. The content file is rendered using for format associated with the file extension.  Typically that is Markdown or AsciiDoc, but it's possible to use EJS/Liquid/etc directly.
1. If a page layout template is defined, that template is run using the specified template engine.  The content from the first stage is available as a variable named _content_.
1. The resulting content is run through the Mahabhuta engine, which supports custom HTML tags and other server-side DOM processing.

The page layout template should be complete HTML starting with the `<html>` tag, the `<head>` and `<body>` tags, and all the rest.

But, how does a content file specify which template to use?

```
---
..
layout: page.html.ejs
..
---
content
```

This says to use a template named `page.html.ejs`.  This makes it an EJS template.  Remember that the template engine used depends on the file extension of the template.

The final output (after partials and Mahabhuta tags are processed) is written to the rendering directory.

# Partials

Partials are template snippets which can be rendered into any location of any template using the `partial` function (or tag).  They are the first stage of implementing arbitrary page layouts.  Partials are an excellent way to implement common elements that are shared between different page layouts.

For example you might have a page header or page footer that must be the same across the site.  Create `header.html` or `footer.html.njk` containing whatever you like.

Partial templates are stored in directories added using the `addPartialsDir` method.

There are two methods for evaluating a Partial:

```html
<partial file-name='helloworld.html'></partial>
<%- partial('helloworld.html') %>
```

The first is an example of a custom HTML tag that's evaluated by Mahabhuta.  The second is an example of calling a function through a template engine.  This case is using EJS syntax, and each template engine has its own syntax for invoking functions.

Because this is a simple `.html` file, its content is simply copied verbatim into the rendering.  By contrast a template name like `footer.html.njk` is processed by the specified template engine.

You can pass data to a partial as so:

```
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
```

The `partial` function supports supplying a JavaScript object in this way.  The object is available for use in the template.

When using the `<partial>` tag, data values are passed this way:

```html
<partial file-name="foo.html.ejs" data-item1="item text 1"
         data-item2="item text 2" data-item3="item text 3"/>
```

In this case the values are available as variables named `item1`, `item2`, and `item3`.

# Custom HTML tags and DOM manipulation with Mahabhuta

The [Mahabhuta](https://github.com/akashacms/mahabhuta) engine allows website authors to perform jQuery DOM manipulations on the server side.  Reusing your jQuery knowledge may be a good thing, we hope.  Mahbhuta makes it possible to reuse jQuery knowledge to reorganize, rewrite, or otherwise manipulate pages on the server side.  Let the concept sink in for a moment, because this can be powerful.

The name?  "Mahabhuta" is the Sanskrit name for the five elements, with Akasha being one of those elements.  The Mahabhuta engine deals with HTML Elements, so it seems like a fitting name.

We've already seen one custom element, `<partial>`.  Most of the AkashaCMS plugins define other custom elements.  Browse the [](/plugins/index.html) for further details.  What follows is a few examples.

We won't go into developing Mahabhuta tags at this point, but let's go over how to use them.  For full documentation see: [Mahabhuta - DOM-processing on the server in Node.js](/mahabhuta/toc.html)

Mahabhuta can perform any DOM manipulation that is possible with the subset of jQuery supported by the Cheerio library.  The most common usage is to define a custom tag, performing a custom DOM manipulation based on that tag.

For example, consider:

```html
<fig-img href="an-image.jpg" 
        class="class-name" 
        id="id-name" 
        style="...CSS..." 
        width="...width..." 
        template="template-partial.html.ejs">
Optional caption text
</fig-img>
```

This custom tag generates a `<figure>` tag enclosing an `<img>` tag, hence the name.  In other words:

```html
<figure>
<img src="an-image.jpg"/>
<figcaption>Image caption</figcaption>
</figure>
```

This custom tag can be a convenient shorthand, if you like.

An alternate approach is to add the `figure` attribute like so:

```html
<img figure class="class-name" 
        id="id-name" 
        style="...CSS..." 
        width="...width..."
        src="an-image.jpg"
        caption="Image Caption"/>
```

A Mahabhuta function recognizes an `<img>` with the `figure` attribute, and does processing to create the `<figure>/<img>` structure shown earlier.

This is another example:

```html
<html>
<head>
..
<ak-stylesheets></ak-stylesheets>
<ak-headerJavaScript></ak-headerJavaScript>
..
</head>
<body>
..
<ak-footerJavaScript></ak-footerJavaScript>
..
</body>
</html>
```

This is a powerful mechanism for including stylesheets and JavaScript in rendered pages.  A typical declaration in the Configuration is:

```js
config
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap-theme.min.css" })
    .addStylesheet({ href: "/style.css" });
config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js"  });
```

This includes CSS and JavaScript required to use Bootstrap, as well as using a custom CSS file.

Another example is an extremely useful DOM manipulation.  For `<a>` tags with an empty body, that reference a local document, the document title is retrieved and used as the anchor text.  In other words, this is for a tag like so:

```html
<a href="/romania/vlad-tepes/history.html"></a>
```

Normally this would render as an empty tag, and the user would not know about the link.  The search engines might even ding your site for attempting some subterfuge.  You could go ahead and add some anchor text, and you're free to do so.  However, as a convenience AkashaRender will do something for you.  It looks for the matching document file, and inserts the `title` metadata from that document as the anchor text.  This way as the title of documents change, the text displayed to readers automagically changes to match.

If you're using Markdown the `<a>` link with an empty body can be written this way:

```html
[](/romania/vlad-tepes/history.html)
```

This is normal Markdown shorthand for an `<a>` tag.  By the time Mahabhuta processes the content it will have been converted to an `<a>` tag, and the Mahabhuta function will not know the difference.

We have two pieces of required Mahabhuta configuration:

```js
config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});
```

This configures the _Cheerio_ engine that Mahabhuta relies on under the covers.  This particular configuration works great for websites.

# JSON Document Files in AkashaCMS

It may be useful for some documents to be _data_ rather than use a recognized text format (like HTML or Markdown).  That is, take some data, formatting it through a template, to make a web page.  To that end, AkashaCMS supports JSON documents that can be processed through the AkashaCMS rendering system and producing HTML.

For example, this file named `json-data.html.json` ([from the akashacms-example](https://github.com/akashacms/akashacms-example/blob/master/documents/json-data.html.json)) repository:

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

The JSON Renderer triggers on file names ending in `.html.json`.  It parses the content body as JSON, passing it as a variable named `data` to the partial named in the `JSONFormatter` metadata field.

The named partial used here is [json-format.html.ejs](https://github.com/akashacms/akashacms-example/blob/master/partials/json-format.html.ejs), or

```html
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

With this data it produces, live copy: https://example.akashacms.com/json-data.html

```html
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

You might be wondering, why don't we have a similar Renderer that uses YAML rather than JSON?  That's not necessary, if you consider this:


```
---
layout: default.html.ejs
title: YAML example
data:
    Row1: "value 1"
    Row2: "value 2"
    Row3: "value 3"
---
<ul>
<%
console.log(data);
var keys = Object.keys(data);
for (var i = 0; i < keys.length; i++) {
    var datum = data[keys[i]];
    %>
    <li><%= keys[i] %> :- <%= datum %></li>
    <%
} %>
</ul>

```

Save this as `yaml-data.html.ejs` so that it is processed using the EJS renderer.  The value `data` comes from the frontmatter.  As you can see, the code steps through the items in this object, outputting each data item.

