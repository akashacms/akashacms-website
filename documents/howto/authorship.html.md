---
layout: how-to.html.njk
title: Adding authorship and bylines
author: david
publicationDate: August 18, 2026
---

Authorship is important for any published content.  Blog posts, news articles, technical documentation — knowing who wrote it and having a way to reach out to them or read more from them creates credibility and transparency.  The `@akashacms/plugins-authors` plugin provides a clean, declarative way to add author information to your AkashaCMS content.

## Why authorship matters

A well-presented author byline does three things:

* **Identifies the author** makes the content feel more personal and accessible
* **Creates authority** a recognized author with known credentials builds trust
* **Enables discovery** clicks from author bio pages can drive additional traffic

This plugin handles the backend bookkeeping and provides custom HTML elements to display authors in layout templates.

## Installing the plugin

The authors plugin is distributed via npm.  Add it to your `package.json` dependencies:

```json
"dependencies": {
    "@akashacms/plugins-authors": "^0.10.x"
    ...
}
```

As of this writing, the plugin is not available in NPM and therefore the dependency must be recorded as:

```json
"dependencies": {
    "@akashacms/plugins-authors": "akashacms/akashacms-authors#0.10"
}
```

This retrieves the plugin from the correct branch in its GitHub repository.

Then run `npm install`.

## Configuration in config.mjs

The plugin requires two pieces of configuration in your main `config.mjs` file:

1. **Plugin registration** — loading the plugin import
2. **Plugin options** — defining your authors and optionally a default

Here is how it looks in the AkashaCMS website configuration (config.mjs:268-277):

```js
import { AuthorsPlugin } from '@akashacms/plugins-authors';

config
    // ...
    .use(AuthorsPlugin, {
        default: 'david',
        authors: [
            {
                code: 'david',
                fullname: 'David Herron',
                url: '/about.html'
            },
            {
                code: 'guest',
                fullname: 'Guest Author',
                url: '#',
                bio: '<p>A special guest contributor</p>'
            }
        ]
    })
    // ...
```

### Configuration options explained

* **`default`** — The code of an author to use when content doesn't explicitly specify an author. This is useful for default attribution for multiple authors or to fall back gracefully.

* **`authors`** — An array where each object defines one author:
  * **`code`** — A unique identifier string used throughout the system (appears in frontmatter and on custom elements)
  * **`fullname`** — How the author should be displayed
  * **`url`** — The link target for the author name (typically their bio page or portfolio)
  * **`bio`** — Optional HTML for an author's full biography (used with the bio-block element)

The configuration uses your project's actual author names and URLs; the example shows generic values for illustrative purposes.

## Adding author metadata to content

Each document in `documents/` declares which author should be associated with it.  In the frontmatter, add the `author` field:

```yaml
---
title: "Understanding Authorship in AkashaCMS"
author: "david"
publicationDate: "2026-04-15"
teaser: "A comprehensive guide on adding author attribution to your content"
tags:
    - "howto"
    - "authors"
    - "documentation"
---
```

Multiple authors can be specified as a list:

```yaml
author: "david"
coauthors: "[\"maria\", \"sven\"]"
```

When multiple authors are present, AkashaCMS handles them gracefully — the order and display depends on your template choices.

## Displaying authors in layouts

The plugin provides two custom HTML elements for displaying author information:

### authors-byline

The `<authors-byline>` element renders a compact byline like:

```html
By <a href="URL">Author Name</a>, <a href="URL">Co-author Name</a>
```

This is the most common element for blog posts, news, and articles.  It appears in the blog template (layouts/blog.html.njk:53-55):

```html
<section id="author-byline" class="col-sm-12">
  <authors-byline></authors-byline>
</section>
```

#### Customizing the element

You can override the default output using attributes:

* **`data-authors`** — Single author code: `<authors-byline data-authors="authorcode">`
* **`data-authors="[\"code1\", \"code2\"]"`** — Multiple author codes
* **`template="custom-partial.html.ejs"`** — Use a custom template instead of `authors-byline.html.ejs`
* **`id="my-author"`** — Add an ID attribute
* **`class="extra-class"`** — Add CSS classes
* **`style="color: #333;"`** — Inline styles

### authors-bio-block

Use this element when you want to show a full author bio:

```html
<authors-bio-block data-authors="david"></authors-bio-block>
```

This displays the author's name, URL, and bio HTML if configured.  It's typically used on author pages or for in-article author bios.

## Complete usage example

Here is a complete workflow for adding authorship to a new article:

1. **Configure authors** in `config.mjs`:

```js
import { AuthorsPlugin } from '@akashacms/plugins-authors';

config
    .use(AuthorsPlugin, {
        default: 'david',
        authors: [
            {
                code: 'david',
                fullname: 'David Herron',
                url: '/about.html',
                bio: '<p>David Herron is a software developer and technical writer specializing in Node.js, JavaScript, and static site generators. He maintains several open-source projects and writes about web technologies.</p>'
            }
        ]
    });
```

2. **Create your article** in `documents/blog-post.html.md`:

```yaml
---
title: "Introducing AkashaCMS"
author: "david"
publicationDate: "2026-08-18"
tags: ["introduction", "tutorial"]
---

This article introduces the AkashaCMS static site generator...

<!-- Content here -->
```

3. **Add a byline** to your article layout (layouts/blog.html.njk):

```html
<section id="author-section">
  <h3>Author</h3>
  <authors-byline data-authors="{{ author }}"></authors-byline>
</section>
```

4. **Render and publish** your site — the output automatically includes the author name and link.

## Related documentation

The `@akashacms/plugins-authors` package includes complete reference documentation and additional examples:

* [Plugin documentation](/plugins/authors/index.html)
* [Authors plugin source](https://github.com/akashacms/akashacms-plugin-authors)

Use the links in the documentation to see advanced usage patterns, more configuration options, and the complete API for customizing author display behavior.