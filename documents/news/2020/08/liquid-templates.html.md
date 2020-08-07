---
layout: blog.html.liquid
title: Added support for Liquid templates to AkashaCMS, no performance improvements
publicationDate: August 6, 2020
blogtag: news
teaser: |
    AkashaCMS was designed to support multiple layout rendering engines, but I never went beyond implementing EJS templates.  The EJS template engine is competent, but there are many other engines with huge capabilities that could potentially be useful in AkashaCMS.  I have two thoughts in mind, to bring in more powerful template engines, but to also find which template engine has the best performance.  In other words, it's possible to improve AkashaCMS performance by adopting a different template engine.
---

Let's first talk about how to use Liquid templates, and then we'll talk about the performance measurements.

# Using Liquid templates in AkashaCMS

Liquid Templates appears to have been developed by Shopify and is documented here:  https://shopify.github.io/liquid/

The implementation used in Node.js is a port of the Ruby engine created by Shopify to JavaScript.  FWIW the module is documented here: https://www.npmjs.com/package/liquid

In an AkashaCMS documents directory files are named as always:  `example.html.md` for a Markdown document, for example.

Where the choice of template comes in is the `layout` tag.  For example:

```yaml
layout: blog.html.liquid
```

Until now your choice would have been to put `blog.html.ejs` here for EJS templates.  But now you can use `blog.html.liquid`, which then requires implementing the matching template.

Once you've done that your template can use all the capabilities of Liquid templates.  In the templates I've created for my websites, the capabilities I've needed were to present values in a template, and to test the existence of a variable to control whether or not to include certain markup.

In most template languages there are two ways to access a value -- one way is to present the value encoded in HTML, and the other being to present the raw value.  The encoded version is safer because HTML in the string is encode, rather than presented as the HTML, which means if there any nefarious code is neutered.  The unencoded version is required in many cases because we'll have rendered some HTML and need to include it in the rendered file.

For example:

```html
<title>{{ title | escape }}</title>
```

In Liquid all value references are within double curly-braces, `{{ value }}`.  Liquid has an extensive list of filter functions available, and it's easy to add your own filters.  The filter used here, `escape`, handles encoding the string as safe HTML.

```html
{{ content }}
```

In AkashaCMS, the `content` variable has the HTML from the rendered document.  That is, it is the output of rendering Markdown or AsciiDoc to HTML.  That HTML needs to be presented as-is rather than encoded.

```html
{% if teaser %}
<strong><ak-teaser></ak-teaser></strong>
{% endif %}
```

The last thing we'd wish to do is to optionally present some markup.  In this case if a teaser has been set, then we'll embed the teaser in the rendered document.  But if no teaser is set, then we want nothing to be rendered.

There is plenty more to explore as capabilities of the Liquid template engine.  And there are plenty more options to express in the AkashaCMS API.

For example, the Liquid template implementation lets you add more tags and other customizations.  That needs to be surfaced as a method on the Plugin object, so that AkashaCMS configuration files can customize the Liquid engine.

Another thing remaining to do is support Liquid templates for Partials.

The last thing to do is to explore other template engines.  As said earlier, one purpose was to improve performance, and it appears Liquid did not do anything for performance.

# Performance of Liquid templates in AkashaCMS

I've created a workspace, `akashacms-perftest`, that is an AkashaCMS site that will render a thousand pages.  The idea is to have a significantly large workload to measure how long it will take to render a site with different software options.  It appears I've not published this workspace yet.

The timings were created by running the command:

```
$ time akasharender render _config-file.js_
```

In the `akashacms-perftest` workspace I have a documents directory containing documents using an EJS template.  For this test I duplicated that directory, then changed the layout tag in each document to use the Liquid version of that template.  Hence, it is the exact set of documents, but renderable using either an EJS or Liquid template.

```
AkashaRender EJS

real    1m20.037s  user    0m45.280s   sys     0m5.292s
real    1m12.638s  user    0m44.590s   sys     0m5.347s
real    1m25.463s  user    0m44.043s   sys     0m5.130s
real    1m25.197s  user    0m44.225s   sys     0m5.067s
real    1m25.638s  user    0m46.423s   sys     0m5.450s
real    1m23.295s  user    0m43.698s   sys     0m5.081s
```

This is the times for rendering the site that uses EJS templates.

```
AkashaRender Liquid

real    1m20.700s  user    0m45.255s  sys     0m5.118s
real    1m18.224s  user    0m46.492s  sys     0m5.132s
real    1m24.469s  user    0m46.481s  sys     0m5.155s
real    1m24.154s  user    0m45.897s  sys     0m5.165s
real    1m26.474s  user    0m45.294s  sys     0m5.216s
real    1m25.310s  user    0m45.761s  sys     0m5.114s
```

And this is the times for rendering the site that uses Liquid templates.

As you can see, the numbers are roughly the same.  In other words, this did not produce the desired performance improvement.  So... back to the drawing board, it seems.

