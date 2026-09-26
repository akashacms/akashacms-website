---
layout: getting-started.html.njk
title: Custom document grouping
rightsidebar:
author: david
publicationDate: August 6, 2026
step: 11
---

The [_document group_](/akasharender/document-groups.html) feature makes it easy to group documents based on their attributes.  For example, the [`@akashacms/plugins-blog-podcast`](/plugins/blog-podcast/index.html) plugin supports grouping the documents that are part of a _blog_ to present them in a blog-like manner.

The `<document-group>` custom tag lets a site author create an ad-hoc document group, to present each matching document using a template.

For a concrete example, consider the index page for the AkashaCMS [_Quick Start_](/quick-start/index.html) area.  Each page in this area has a sidebar listing the quick start guide pages.  The `index.html` page needs to present the same list, as a nice index.

This is the same document group -- the documents which are part of _Quick Start_ -- presented in two ways.  The two presentations are handled by different partial templates.

## Designing the document group

Let's start with identifying the document group.  Namely:

* The files under `/quick-start` that render to HTML
* Ignore `index.html`
* Sort the documents using a custom `step` header -- the `step` frontmatter field will control the ordering of the documents in the group

The first step is to validate the selector using the `search` command:

```shell
npx akasharender search config.mjs \
        --root quick-start \
        --renderglob '**/*.html' \
        --skipglob '**/index.html' \
        --sort-by step
```

This produces a large YAML blog.  Piping that into `grep vpath` will make the output more manageable.

The `--renderglob` option selects files with a rendering path which ends in `.html`.  Therefore it has selected for files which "_render to HTML_".

The `--skipglob` option makes sure to ignore `index.html` because it's not a quick-start document, but the index page for the quick start area.

The `--sort-by` option sorts the documents by a custom frontmatter field, `step`, where we'll place a number to control the ordering.

IMPORTANT NOTE:  In this case we want to use a numerical field, and we need to make sure the frontmatter field is numerical.  The frontmatter is parsed as YAML, and therefore we must use:

```yaml
step: 12
```

Rather than

```yaml
step: "12"
```

The latter, where the YAML frontmatter for `step` is interpreted by the YAML parser as a string, would sort alphabetically rather than numerically.

Once you're happy with the selector, convert it into a `<document-group>`:

```html
<document-group
        root-path="quick-start"
        render-glob="**/*.html"
        skip-glob="**/index.html"
        sort-by="step"></document-group>
```

This is the starting point for the `<document-group>` tag.  Since it lacks a `template` attribute you'll just get an error.

## Quick start document group index page presentation

After some experimentation, it was determined the index page should present the document group as three columns of "_cards_".

Because this website uses the Bootstrap framework, this means a Bootstrap Card Group where the cards are laid out using the [Bootstrap grid system](https://getbootstrap.com/docs/5.3/components/card/#grid-cards).

To set that up, the document group tag becomes this:

```html
<document-group
        id="getting-started"
        class="row row-cols-1 row-cols-md-3 g-4"
        root-path="quick-start"
        render-glob="**/*.html"
        skip-glob="**/index.html"
        sort-by="step"
        template="doc-group-list.html.ejs"></document-group>
```

The `class=` attribute sets up the grid system.

For each entry in the document group, the partial template named in the `template=` attribute is rendered.  The data for the document entry is in the variable named `entry`.

The template file, `doc-group-list.html.ejs`, is in the `partials/` directory.  Its task is to format each document in the group to be a card in the grid we've defined:

```html
<div class="col">
<div class="card">
    <div class="card-body">
    <b class="card-title"><a href="/<%= entry.renderPath %>"><%= entry.title %></a></b><% if (entry.teaser) { 
        %>: <span class="card-text"><%= entry.teaser %></span><% 
    } %>
    </div>
</div>
</div>
```

The `<div class="col">` container places this item in the grid system.

The `<div class="card">` container makes this a card.

The other elements within that container declare the parts of the card.

Look closely at the `<a>` tag, and how the `href=` starts with a `/`.  The rationale is that the `renderPath` does not have a leading slash.  Further, AkashaCMS will autoconvert an absolute path to a relative path, but it will not do this with a non-absolute (relative) path.

Adding the slash makes it an absolute path, which is then converted to a relative path.

## Quick start document group sidebar presentation

Each page in the _quick start_ area uses the layout template `getting-started.html.njk`.  In that template, the left-hand sidebar had a simple hardcoded list of links.  The goal is to replace that list with a `<document-group>`.

The page needs a simple list.  In Bootstrap, a good fit for this is the _List Group_ structure.

One form for the _List Group_ is a `<div>` containing `<a>` elements for the links in the list group.  This maps directly to the structure we can construct with `<document-group>`.

In the template, replace the list of hardcoded links with this:

```html
<document-group id="quick-start-sidebar"
    class="list-group"
    root-path="quick-start"
    render-glob="**/*.html"
    skip-glob="**/index.html"
    sort-by="step"
    template="doc-group-link.html.ejs"></document-group>
```

Using `class="list-group"` makes the `<div>` generated by `<document-group>` to be a list-group container.

The template, `doc-group-link.html.ejs`, is:

```html
<a  class="list-group-item list-group-item-primary" 
    style="color: black;"
    href="/<%= entry.renderPath %>"><%= entry.title %></a>
```

Because the AkashaCMS website uses the _Pulse_ theme, the `list-group` sidebar was, by default, a black background with light grey text.  I didn't like that.

Using `list-group-item-primary` helped by giving a light colored background, but the text was still light grey, making it unreadable.

In the browser developer tools it was clear that the Pulse `list-group-item` was the source of this text color.  The only fix was to add this `style=` attribute to use black text.

## Performance - `search(selector)` is auto-cached

You might be thinking each `<document-group>` invocation reruns the full `search(selector)` operation, meaning an SQL query each time.

Nope.

Inside `search(selector)` is a cache.  The response data is cached for each unique selector string.

That means the response data is retrived once, and every subsequent time comes from the cache.

## Conclusion

The `<document-group>` tag, and the _Document Group_ concept, are powerful features.

By using the `<document-group>` tag, we have refurbished the _Quick Start_ section of this site to be easier to maintain.  We're no longer keeping a hard-coded list of links.  Instead, the list is recomputed on every build.  We can reorder the list by changing the sort terms.  We can make the list look like anything by changing the templates.

