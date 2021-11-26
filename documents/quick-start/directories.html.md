---
layout: getting-started.html.njk
title: AkashaCMS project directories
rightsidebar:
author: david
publicationDate: November 22, 2021
---

An AkashaCMS project is a melding together of content from four classes of directories.  When showing [how to create a configuration file](configuration.html), we showed configuring these directories:

* `assets` is a directory structure containing project assets
* `documents` is a directory structure containing the content for the project
* `layouts` contains page layout templates used in the project
* `partials` contains template snippets used in the project

We also mentioned that the actual reality is not as simple as this.  We set up these directories using the following configuration file stanza:

```js
config
    .addAssetsDir('assets')
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addPartialsDir('partials');
```

This means each of these directories are assigned into one category or another.  The `assets` directory is assigned to the _Assets_ category, the `layouts` directory to the _Layouts_ category, the `documents` directory to the _Documents_ category, and the `partials` directory to the _Partials_ category. 

There is an additional directory, the _Rendering_ directory, which was not shown in the configuration file.  This directory is where all rendered files land.  Since we did not configure a name for this directory, AkashaRender gave it the name `out`.  

That means we have five classes of directories:

* _Assets_ one or more directories containing project assets
* _Layouts_ one or more directories containing page layout templates
* _Documents_ one or more directories containing the content for the project
* _Partials_ one or more directories containing template snippets
* _Rendering_ is exactly one directory containing the rendered project

These three use cases drove the development of this feature:

1. AkashaCMS plugins might provide prebaked Assets, Layouts or Partials.
1. One AkashaCMS plugin, or an AkashaCMS project, might want to override a file in an Assets, Layouts or Partials directory.
1. An AkashaCMS project might want to assemble content from several sources.

To satisfy these use cases, AkashaRender supports a _directory stack_ for the _Assets_, _Layouts_, _Documents_, and _Partials_ directory categories.  By "stack" we mean that there are virtual directories, `assets`, `documents`, `partials`, and `layouts`, which are a sort of merging of the actual directories in the corresponding directory categories.

The basic rule is that the directories in each stack are listed in order.  When AkashaRender looks for a file in a virtual directory stack, it searches the directory in order, using the first matching file it finds.

But, there is still more involved in fully describing this feature.  For the rest of this discussion it will be useful to refer to [the Configuration file for this website](https://github.com/akashacms/akashacms-website/blob/master/config.js).  It has a very complex directory stack structure pulling together content from multiple sources.

# Stacked directories and overridable files

AkashaCMS plugins supply code that extends or modifies AkashaCMS behavior.  A typical case is for a plugin to define a custom tag (using Mahabhuta), and for the tag to have a default template in the Partials directory.  This means the plugin has its own `partials` directory, while the AkashaCMS project also has a `partials` directory.  Since there are several plugins, each with its own `partials` directory, how does AkashaRender decide which directory from which to retrieve the template?

Both the plugin definition, and the AkashaCMS project configuration, use the same method:

```js
config.addPartialsDir('partials');
```

The `addPartialsDir` method adds a directory the `partialDirs` array in the configuration object.  There are similar methods and arrays for Assets, Documents and Layouts, but lets focus on Partials.  The `config.addPartialsDir` method will be called multiple times, each one adding a directory name to the `partialDirs` array.

It's helpful to think of the `partialDirs` array as a _stack_ of directories, one on top of the other.  To look for a file, we look for which directory/ies in the stack contains this file, using the top-most file.

You can inspect the stack in an AkashaCMS project by running this command:

```
$ akasharender partialdirs config.js 
[
  '.../guide/partials',
  '.../guide/node_modules/@akashacms/theme-bootstrap/partials',
  '.../guide/node_modules/@akashacms/plugins-base/partials',
  '.../guide/node_modules/@akashacms/plugins-breadcrumbs/partials',
  '.../guide/node_modules/@akashacms/plugins-tagged-content/partials',
  '.../guide/node_modules/@akashacms/plugins-blog-podcast/partials',
  '.../guide/node_modules/akasharender/partials'
]
```

What is actually stored in this array is the full path-name, but I've edited out the prefix of each for the sake of space.  The first in this list is in the project directory, the next is in the `theme-bootstrap` plugin, and the last is associated with the `buitl-in` plugin which is part of AkashaRender.

There are similar commands named `akasharender docdirs`, `akasharender assetdirs`, and `akasharender layoutsdirs`, for the corresponding directory categories.

Consider what AkashaRender does when asked to render a partial template, like `ak_toc_group_element.html.njk`.  This template is used in constructing a table of contents for a given page, and there is an implementation in both the `@akashacms/plugins-base` and `@akashacms/theme-bootstrap` plugins.  Further, an AkashaCMS project might have its own implementation of this template.  What happens is, AkashaRender checks each directory in turn to see if the directory contains a matching file.

That's the key pattern: To search through an array of directories, returning the first matching file.

## Stacked Directories module

The actual implementation is not that simple.  It used to be implemented as just described, but implementing `akashacms watch` changed a lot of things.

Today, there is a module, _Stacked Directories_ ([see blog post](/news/2021/06/stacked-dirs.html)), that watches the contents of the directory stack.  It continuously watches the files looking for changes, so that the `watch` command can then cause files to be re-rendered.

There are four instances of the stacked directory module, one for each directory stack (`assets`, `documents`, `partials`, and `layouts`).  Data collected through the module is then stored in an internal cache.

When AkashaRender is looking for a partial template, it calls the `find` method on the cache.  It looks in the Partials collection, and one of the parameters is the virtual path `ak_toc_group_element.html.njk`.

The query response is guaranteed to have the same result as described above - that it will return the first match in the directory stack.  It's just that the implementation is more complicated than a loop looking in one directory followed by another.

The simple answer is that it returns the first file it finds.

Again, the same algorithm is used for Assets, Documents, and Layouts.

# Mounting directories

Some projects need to assemble content from multiple locations.  For example a website for a software product might have content from the marketing, engineering, or tech-pubs teams.  It's best if each team is able to work on its own, and that somehow the content be merged into one website.  In this section lets discuss how that's done.

Refer back to the `config.js` for the AkashaCMS website, and you'll find a long list of declarations like this:

```js
config.addDocumentsDir({
    src: 'node_modules/@akashacms/plugins-base/guide',
    dest: 'plugins/base'
})
```

This is different from the `config.addPartialsDir('partials')` case we just discussed.  What's going on?

We've supplied an object with two fields, `src` and `dest`.  The `src` field refers to a directory within `node_modules` and if you consult that directory you'll find `index.html.md` and some other content files.  The `dest` field is interpreted as a location within the Documents directory structure.

Each module in the AkashaCMS project is in its own Github repository, and many of the modules are distributed through the npm repository.  We decided that documentation for each plugin should be in a `guide` directory.  What we're doing is to assemble those `guide` directories so they are used on the AkashaCMS website.

Some examples are:

Project | Path | Mounted to
--------|------|-------------
`@akashacms/plugins-base` | `node_modules/@akashacms/plugins-base/guide` | `plugins/base`
AkashaCMS Built-In | `node_modules/akasharender/built-in-guide` | `plugins/built-in`
`@akashacms/plugins-authors` | `node_modules/@akashacms/plugins-authors/guide` | `plugins/authors`
`@akashacms/plugins-booknav` | `node_modules/@akashacms/plugins-booknav/guide` | `plugins/booknav`
`@akashacms/plugins-blog-podcast` | `node_modules/@akashacms/plugins-blog-podcast/guide` | `plugins/blog-podcast`
`@akashacms/plugins-breadcrumbs` | `node_modules/@akashacms/plugins-breadcrumbs/guide` | `plugins/breadcrumbs`

There are a lot more of these.

The resulting rendered output directory contains this:

```
$ tree -d out/plugins
out/plugins
├── adblock-checker
├── affiliates
├── akasharender-epub
│   └── img
├── authors
├── base
├── blog-podcast
├── booknav
├── breadcrumbs
├── built-in
├── document-viewers
├── embeddables
├── external-links
├── footnotes
├── tagged-content
└── theme-bootstrap
    └── img

17 directories
```

There is no single input directory structure.  Instead there are several input directories, each coming from their own Github repository, and each virtually mounted into into the `documents` directory.

In the scenario named earlier, the configuration might be:


```js
config
    .addDocumentsDir({
        src: '/path/to/marketing/content',
        dest: 'marketing'
    })
    .addDocumentsDir({
        src: '/path/to/support/content',
        dest: 'support'
    })
    .addDocumentsDir({
        src: '/path/to/documentation/content',
        dest: 'docs'
    })
    .addDocumentsDir({
        src: '/path/to/blog/content',
        dest: 'blog'
    })
```

Each team would be in charge of the content stored in each corresponding directory.  How you organize this is up to you.  This demonstrates that AkashaCMS can be used to draw together content from any number of sources.

# Configuring the Rendering directory

We have one last directory to discuss, `out`, which we described as holding the rendered output from the project.

The final result of AkashaCMS is a collection of _rendered_ files, and this directory is where those files land.

The directory can have any name you like.  In `config.js` simply call this method:

```js
config.setRenderDestination('rendered-output');
```

Feel free to give it any name you like.  If your `config.js` does not call this method, the default name is `out`.
