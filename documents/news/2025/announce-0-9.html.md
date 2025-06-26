---
layout: blog.html.njk
title: Announcing AkashaCMS v0.9 - many improvements
publicationDate: June 25, 2025
blogtag: news
teaser: |
    After a lot of experimentation and rearchitecting, AkashaCMS 0.9 is now available.

---

The new release embodies two themes:

* Improved content indexing by using an in-memory database (SQLITE3)
* Building independent tools using AkashaCMS components

The in-memory database is meant to bring greater fluidity to how AkashaCMS components organize and use content documents.  Originaly we used LokiJS, but abandoned it after it became clear that project was abandonware.  SQLITE3 was chosen because it supports JSON data, and is a mature, well tested, database.

In AkashaCMS, site content falls into four groups:

* _assets_ which are non-rendered files like CSS, JavaScript, or images
* _partials_ which are template snippets
* _layouts_ which are page templates
* _documents_ which is the main content of a site, and is typically Markdown which is rendered through a template into an HTML file

AkashaCMS has four content caches corresponding to those four groups.

The base content cache class uses the separate Stacked Directories module to handle the AkashaCMS policy of multiple directory trees forming a virtual filesystem.  The content cache records files reported by Stacked Directories, and updates the cache as files are added, removed, or modified.

Each of the four content groups is a subclass of the base content cache.  The subclasses have additional methods suitable for each content group.  For example, the documents cache parses the frontmatter, and indexes the fields.  For certain fields, like `layout`, `tags`, and `blogtag`, the documents cache explicitly indexes their values.

The theme of using an in-memory database for improved content indexing is meant to provide at least two gains:

* Greater reliability and functionality by having content in a well defined data store
* Improve performance through data indexing

The first themes has been fulfilled very well.  The second remains elusive.  My primary performance measure is the time required to render `techsparx.com`, which was about 10 minutes before and after switching from LokiJS to SQLITE3.

The second theme, implementing standalone tools using AkashaCMS components, has its first concrete product.

[PDF Document Maker](https://akashacms.github.io/pdf-document-construction-set/index.html) is a command-line tool for converting AkashaCMS documents into a high fidelity PDF.  The goal is to produce professional-quality PDF documents, the sort which a business or standards body might produce, using programmer-friendly input files like Markdown and AsciiDoc, and allowing the content creator to commit their documents to a Git repository.

The first draft of this tool was developed in the context of my work with a standards organization defining an Internet protocol.  We'd been happily using Google Workspace to edit the specification documents using Google Docs.  Its excellent support for collaborative editing let us quickly co-develop the standard.  But, it became useful to move editing to Markdown files in a Git repository to simplify filing issues, and using pull requests to edit the specification.

The goals and user stories for PDF Document Maker came from analyzing the needs of a group like this.  It had to be easy to output a professional-looking Document similar to what would be produced with Microsoft Word.  Finally, it had to be easy to use.

PDF Document Maker can render documents using command-line options, no configuration file required.  The AkashaCMS config object is generated on the fly from the options.  Built-in are a long list of Markdown-IT plugins and other tools to improve output fidelity.

As I used it on various projects, I developed additional user stories, and have added commands for many PDF manipulation scenarios.

Along the way some under-the-cover changes were made:

* Adopting ESM modules - we all need to move away from CommonJS modules
* Switching to TypeScript source code and compile-time type checking
* Spinning off a separate Rendering Engines project for the content rendering support
* Spinning off the Stacked Directories project which handles real-time indexing of the AkashaCMS directory stacks (discussed above)

As of June 25, 2025, all AkashaCMS plugins and other components have been updated to this model:

* Version number 0.9.x range (except for the Bootstrap theme plugin)
  * The current Bootstrap theme has the 4.6.x version number range to correspond to the Bootstrap version
  * It's intended to migrate to Bootstrap 5.x and when that's done a new branch will launch with a corresponding version number
  * This plan allows for easy migration.  A project/site currently on 4.6.x can stay with it, and switch to 5.2.x when it's ready.
* Supporting Node.js 24.x and later

So many improvements have gone into Node.js 24 that it made sense to make the switch.

# Migrating to AkashaCMS 0.9

AkashaCMS components function largely the same as the 0.8 components functioned.  This means you

* Change the version numbers in `package.json`
* Convert the `config.js` to `config.mjs`
* Switch to ESM module syntax in `config.mjs`

The switch to ESM module syntax is relatively easy.  Instead of using `.use(require('module-name'))` inline, you do:

```js
import { ModuleNamePlugin } from '@akashacms/plugins-name';
// ...
config
    // ...
    .use(ModuleNamePlugin)
    // ...
    ;
// ...

config.prepare();

export default config;
```

This conversion is easily done, and everything else will remain the same.

For guidance, study the configuration files in the `akashacms-example` and `akashacms-website` repositories.
