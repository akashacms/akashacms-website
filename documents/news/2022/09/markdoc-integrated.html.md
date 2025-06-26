---
layout: blog.html.njk
title: Markdoc support added via Renderers package
publicationDate: November 6, 2022
blogtag: news
teaser: |
    Markdoc is Markdown with extensions making it like a template engine sort of.
heroPicture:
    url: /news/2022/09/img/markdoc-added-akasharender.png
---

Stripe developed Markdoc (https://markdoc.dev/) to use in their documentation website.  It is a new variant of Markdown, that implements a superset of the CommonMark specification.

The result looks like a marraige between Markdown and Handlebars or Nunjucks templates.  An example will make this clear:

```
{% tag %}
Content
{% /tag %}
```

It supports _tags_ between `{% .. %}` markers.  It is relatively easy to create custom tags.  Tags can take input values (parameters) depending on the tag.

```
Here I am rendering a custom {% $variable %}
```

It also has variables, which can be substituted into the output like so.  It also supports frontmatter -- in Renderers/AkashaRender we only support YAML frontmatter -- and those values appear as variables.

```
# Examples {% #examples %}
```

In Markdown content, you can add an expression like this to add attributes to the tag that's generated.

```
{% if and(not($a), or($b, $c)) %}
This is shown only if $a is falsy and either $b or $c is true.
{% /if %}
```

There is an _if_ tag that can selectively render content.

There are several other features, but this is enough for now.

To use Markdoc, use the extension `.html.markdoc`.

