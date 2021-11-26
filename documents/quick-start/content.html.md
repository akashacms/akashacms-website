---
layout: getting-started.html.njk
title: Content files
rightsidebar:
author: david
publicationDate: February 18, 2021
---


In an AkashaCMS project, _content files_ are stored in document directories, meaning the directories added using the `addDocumentsDir` method.  These files are either copied or rendered from a document directory into the appropriate place in the rendered output directory.  AkashaRender inspects the file extension to decide on one of two courses of action:

1. Some files are simply copied to the rendered output directory
1. Some files are rendered or otherwise processed into the output directory

While usually the rendering process converts the file from one formation to another (like Markdown to HTML), some files require no conversion. 

As we [discussed elsewhere](outputdir.html), the path the file has within the output directory depends on the path it has in the document directory.  For example, a content file `/path/to/document-dir/some/path/to/file.ext` will be rendered to `/path/to/output-dir/some/path/to/file.ext`.  But of course there are lots of details to consider.  In that section we went over how the directory configuration affects what happens.  In this section we'll discuss the content files which require rendering.

Obviously some files we want to put in a content directory require no processing, and are just copied to the output directory.  For example with simple CSS files, JavaScript files, image files, or audio files, no processing is required.

But, AkashaCMS has a goal of simplifying creating content, and for that purpose it supports both Markdown and AsciiDoc content.  Both of those obviously require conversion into HTML for display on the Web, or into XHTML for inclusion in an EPUB.

# Renderers, Rendering and File Extensions

AkashaRender's rendering system is very flexible, handling several kinds of input files.  The system is pluggable, meaning that every file type is handled by an instance of the Renderer class.  The Renderer instance for a given file is determined by matching the file name, typically the file extension.  In most cases the Renderer matches a double file extension, such as `.html.md`, which means a Markdown file that's converted to HTML.

Several Renderers are built-in to AkashaRender:


Type | Extension | Description
-----|-----------|------------
Markdown | `example.html.md` | A Markdown file, that produces HTML.
AsciiDoc | `example.html.adoc` | An AsciiDoc file, that produces HTML.
EJS | `example.html.ejs` or `example.php.ejs` | for HTML, or PHP, with EJS markup, that produces HTML or PHP.
Liquid | `example.html.liquid` | For HTML, with Liquid markup, produces HTML
Nunjucks | `example.html.njk` | For HTML, with Nunjucks markup, produces HTML
Handlebars | `example.html.handlebars` | For HTML, with Handlebars markup, produces HTML
LESS | `example.css.less` | A LESS file, that produces CSS.
JSON | `example.html.json` | A JSON file, with metadata header, producing HTML
Fallback | any unmatched file | copied with no processing.

Creating a Renderer plugin is very easy.  What matters most in this regard is whether an implementation of your favorite template engine exists for Node.js.  The Renderers in this table are automatically registered and ready to use.  Implementing a custom Renderer requires implementing a Renderer (or HTMLRenderer) subclass, then registering that class with the Configuration.

The Renderers that currently exist take a double extension (e.g. _castle-peles.html_._md_) and output a file with a single extension (_castle-peles.html_).  The double extension was originally designed to indicate a conversion from one format, Markdown, to another, HTML.

Several Renderers subclass from HTMLRenderer, which is a subclass of Renderer.  These renderers (Markdown, AsciiDoc, EJS, Liquid, Nunjucks and Handlebars) provide additional HTML processing capabilities.

1. They support using a layout template to format the HTML page.
1. They support YAML frontmatter to store document metadata.
1. They use the Mahabhuta engine to support custom HTML tags and custom DOM processing.

To produce EPUB's, we must use the `akasharender-epub` plugin.  It includes additional support for ensuring the files are produced in XHTML format, with the `.xhtml` file extension.

## Special considerations for PHP

Notice that the EJS Renderer supports the `.php.ejs` file extension.  This means we can create PHP scripts on an AkashaCMS website, but there is a special consideration.

It's been determined that if PHP code is processed by Mahabhuta, the custom HTML tag engine, the tags get screwed up.  As a result in `EJSRenderer` the `doMahabhuta` method returns `false` for PHP files.  As a result Mahabhuta processing is automatically skipped, meaning that Mahabhuta tags will not be expanded in PHP files.

That limits how much you can do inside a PHP file.  A workaround is code like this:

```
<%- config.plugin('akashacms-base').doHeaderMetaSync(config, locals) %>
<%- config.plugin('akashacms-base').doGoogleSitemap(locals) %>
<%- partialSync('google-site-verification.html') %>
<%- config.plugin('akashacms-builtin').doStylesheets(locals) %>
<%- config.plugin('akashacms-builtin').doHeaderJavaScript(locals) %>
<%- partialSync("php-recaptcha-check.html") %>
```

And

```
<%- partialSync('topnavbar.html') %>
<%- partialSync('siteheader.html.ejs') %>
```

In other words, you can make function calls to AkashaRender functions and thereby get access to certain capabilities.

The `partialSync` function can take a data object like so:

```
<%= partial('some-partial.html.ejs', locals) %>
<%= partial('some-partial.html.ejs', {
    data: "value", data2: "value2"
}) %>
```

The values passed are of course available as template variables.  The special variable `locals` passes along the template variables used in this template.

## Markdown

AkashaRender uses the [Markdown-it](https://www.npmjs.com/package/markdown-it) markdown processor.  This gives us quite a lot of capabilities, as well as a focus on the [CommonMark](http://commonmark.org/) spec.  As nice as Markdown is, the original "specification" was not terribly precise leading to some fragmentation among the various Markdown processors.  The CommonMark spec aims to fix that, opening a route to a day of compatibility between Markdown processors.

Perhaps the most useful thing is that Markdown-it adopts the [Tables](https://help.github.com/articles/github-flavored-markdown/#tables) markup from Github Flavored Markdown.

That means:

```
First Header | Second Header
-------------|-------------
Content Cell | Content Cell
Content Cell | Content Cell
```

Renders to

First Header | Second Header
-------------|-------------
Content Cell | Content Cell
Content Cell | Content Cell

It also supports "strikethrough text" where `~~deleted text~~` renders as ~~deleted text~~.

### AsciiDoc

AkashaRender uses the [AsciiDoctor.js](https://github.com/asciidoctor/asciidoctor.js) package to process AsciiDoc.  It is a direct transliteration of the official AsciiDoctor renderer from its Ruby source code.

The integration of AsciiDoc is minimal as of this writing.  It renders content using the _article_ doctype, and doesn't allow you to override that choice.

A subset of AkashaRender metadata is made available to AsciiDoc for use as what they call an _attribute_.  This means your metadata values can be rendered as `{attributeName}`.  

Because of limitations in AsciiDoc, AkashaRender only supplies String and Number metadata values.  Any functions or objects are dropped out of the metadata supplied to AsciiDoc.

AsciiDoc user manual: http://asciidoctor.org/docs/user-manual/

## YAML Frontmatter Metadata

Metadata is the extra/descriptive information attached to a content file.  The content of the content file is its main purpose of existence.  The metadata is carried along, and adds extra bits that are useful for a wide range of purposes.

For an HTMLRenderer file, the metadata is carried as so:

```
---
... metadata in YAML format
---
content
```

This is very simple and easy to create.  Just write the content as normal, and prepend it with this segment surrounded by `---`.

YAML is a full fledged text format to describe data objects in a simple-to-write way.  It's capable of describing complex data objects, containing nested arrays or nested lists.  The best documentation I know for YAML is the Wikipedia page: https://en.wikipedia.org/wiki/YAML

For AkashaRender content files it'll be rare to use anything more than the simplest of YAML.  Namely, something like this:

```
---
title: Gettysburg Address
layout: page.html.ejs
otherTag: otherValue
tag42: "The Meaning of Life"
---
This is the content area.
```

That is, most of what we'll do in AkashaRender will be satisfied by simple `name:value` pairs.  But, because we support YAML, the flexibility is there to go over the top with data modeling if desired.

The metadata is made available during the rendering process, so that metadata values can be rendered into the content.  This can be combined with other parts of AkashaRender, such as Partials and Mahabhuta custom tags.  An example would be a Mahabhuta tag to look up YouTube videos based on YouTube URL's listed in the metadata.

For example:

```
---
layout: video-page.html.ejs
title: Race 4, Buenos Aires pre-race driver interviews (Formula E)
publicationDate: Jan 8, 2015
tags: Electric Racing, Formula E 2014
teaser: Going into the fourth race, drivers talk about their experiences and hopes.
videoUrls:
  - url: https://www.youtube.com/watch?v=O3lHuEmP9-g
  - url: https://www.youtube.com/watch?v=02nVQQeBFjg
  - url: https://www.youtube.com/watch?v=C7QiE9Iguxc
  - url: https://www.youtube.com/watch?v=Itr9N4QpecA
  - url: https://www.youtube.com/watch?v=H3BIYCgLeiw
videoThumbnail: https://www.youtube.com/watch?v=O3lHuEmP9-g
---
```

With a suitable page layout template (see below) this renders these YouTube videos along with associated information, and sets up the Thumbnail from one of those videos in the OpenGraph tags.  The page is tagged to reference the Formula E electric racing series, and was written in January 2015.

Support for metadata variables in renderer

* MarkdownRenderer: No
* EJSRenderer: Can substitute variables into rendered output
* LiquidRenderer: Can substitute variables into rendered output
* NunjucksRenderer: Can substitute variables into rendered output
* HandlebarsRenderer: Can substitute variables into rendered output

