---
layout: blog.html.ejs
title: New AkashaCMS plugin to acknowledge authors on AkashaCMS documents
publicationDate: August 11, 2019
blogtag: news
teaser: |
    It's helpful on many levels to have an author byline, and author bio, on web pages.  Both of these help your readers know who you are and can act to build credibility for a website.  Today we have released a new plugin to serve that purpose.
---

The new plugin, `@akashacms/plugins-authors`, is relatively easy to use.

In the site configuration you bring it in as so:

```js
config.use(require('@akashacms/plugins-authors'), {
    default: "boygeorge",
    authors: [
        {
            code: "boygeorge",
            fullname: "Boy George",
            url: "URL",
            bio: "<p>Weird ass british rocker</p>"
        },
        {
            code: "eltonjohn",
            fullname: "Elton John",
            url: "URL",
            bio: "<p>Mainstream british rocker</p>"
        }
    ]
})
```

The `default` entry is the author code to use if no author code is specified.  

The `authors` entry is obviously a list of authors supported on this site.

To insert an author byline - `<authors-byline></authors-byline>`

To insert an author bio - `<authors-bio-block></authors-bio-block>`

Both of these custom tags are most likely to be used in a layout template.

More information is available in the [documentation for this plugin](/plugins/authors/index.html)