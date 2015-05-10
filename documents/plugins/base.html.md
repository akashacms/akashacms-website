---
layout: article.html.ejs
title: AkashaCMS' website-base-functionality plugin
rightsidebar:
---

The AkashaCMS-base plugin provides generally useful partials, a root layout page, and a long list of Mahabhuta tags.  They work together to provide a comprehensive base for presenting website content.  This had formerly been built-into AkashaCMS, hence had been called `builtin`.

A given website may want to disable parts of the `akashacms-base` plugin.  If so, put this in the config file

```
builtin: {
    suppress: {
        partials: true,   // to suppress the built-in partials
        layouts: true,    // to suppress the built-in layouts
        assets: true      // to suppress the built-in assets
    }
}
```

The layout file, `ak_page.html.ejs`, produces an HTML5 page loosely derived from the HTML5 Boilerplate project (version 4).

    <ak-page-title></ak-page-title>

Generates a `<title>` tag using data from the page metadata, either the `title` or `pagetitle` tag in the frontmatter.

    <ak-header-metatags></ak-header-metatags>

Generates a long list of `meta` tags to be put in the `<head>` section, using the partial file `ak_headermeta.html.ejs`.

    <ak-header-canonical-url></ak-header-canonical-url>

Generates a canonical URL for the page.

    <ak-siteverification></ak-siteverification>

Generates a site verification tag in the `<head>` section, based on data in the site config file.

    <ak-google-analytics></ak-google-analytics>

Generates code to load Google Analytics code into the document.  The Analytics account ID and other data is to be put in the site config file.  It's generated using the `ak_googleAnalytics.html.ejs` partial.

    <ak-sitemapxml></ak-sitemapxml>

Generate a tag for the site sitemap.

    <ak-insert-body-content></ak-insert-body-content>

Insert the content of the `content` variable into the current document.  This is used in layout templates to insert previously rendered content as the template chain is processed.  There is two ways to insert this content, one to use `<%- content %>` in an EJS template.  But if you're not in an EJS template, you can use this tag instead.

    <rss-header-meta href="..."></rss-header-meta>

Adds a link to an RSS file in the `<head>` section.

    <partial file-name="partial-name.html.ejs"></partial>

Inserts the results of processing a partial.  This is [documented elsewhere](/layout/partials.html).

    <publication-date></publication-date>

Generates text to show the publication date of a document, such as you'd present in a byline.  This is formatted by the partial named `ak_publdate.html.ejs` and uses the `publicationDate` variable from the page frontmatter.  

    <author-link></author-link>

Generates code to produce an authorship link, such as you'd present in a byline.  The author is declared in the `authorname` variable in the page frontmatter.  Authors are listed in the `authorship` variable in the site config file.  Author information is formatted with the `ak_authorship.html.ejs` partial.

    module.exports = {
       ...
       authorship: {
         defaultAuthorName: "author name to use if none is specified in a page",
         authors: [
             { name: "name1", fullname: "Full Name", authorship: "...URL of their author page" },
             { name: "name2", fullname: "Full Name", authorship: "...URL of their author page" }
         ]
       }
    }

is what it might look like in the site config file.

    <open-graph-promote-images root="selector"></open-graph-promote-images>

Scans for `<img>` tags, and arranges for them to be added to the `<head>` as OpenGraph metatags.  This helps sites like Facebook know which images to pick off the page.  The `selector` is used to form a jQuery style selector where `img` is appended to whatever is passed in `selector`.  This way the image search is limited to a specific region of the page.  For example you might have article content within an `article` tag, and only want OpenGraph to publicize article images and ignore any image appearing outside the `article` tag.

    <footnote href="http:..." name="..." title="..." rel="nofollow">Description</footnote>

Formats a footnote reference, and adds a footnote section at the bottom of the content area.

Finally, several useful modifications are made to `a` tags that increases metadata and other indicators.

For links to external sites, a `rel=nofollow` indicator can be added to tags depending on the URL.  It consults the `config.nofollow.blacklist` array for a list of regular expressions, and `rel=nofollow` is added if the URL matches any of them.  However, it's not added if the URL matches any of the regular expressions in the `config.nofollow.whitelist` array.

For links to external sites, a little icon is appended after the image to help readers know it's an external link.

For links internal to the site, the document is retrieved and its `title` is inserted as the `title` attribute on the link.  Additionally, if the `a` tag is empty the title text is inserted as the body of the link.  Hence, `<a href="/layout/partials.html"></a>` will automatically become <a href="/layout/partials.html"></a>

[OpenGraph protocol documentation](https://developers.facebook.com/docs/opengraph/) - Some tags supported by `ak_headermeta.html.ejs` are OpenGraph.