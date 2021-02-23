---
layout: getting-started.html.njk
title: Structure of the Rendered Output Directory
rightsidebar:
author: david
publicationDate: February 21, 2021
---

The whole purpose of AkashaCMS is to create a directory containing the content for a website or an EPUB e-book.  We funnel content files, asset files, page layout templates, and partials, through AkashaRender and any desired plugins, to create the desired content in the output directory.

When we've fully rendered the content into the output directory, it is ready to be uploaded to a web server, or to be packaged as an EPUB.

* TODO - import bootstrap icons
* TODO - develop a special block for Principles

An important principle is fairly obvious, that the directory hierarchy of the output directory is determined by the hierarchy of the asset and document directories.

Files in the _layouts_ and _partials_ directories play a supporting role, meaning they are templates from which we construct HTML files.  By contrast, each entry in _assets_ or _documents_ directories directly correspond to an entry in the _output_ directory.

The path the file has within the output directory depends on the path it has in the asset or document directory.  For example, a content file `/path/to/document-dir/some/path/to/file.ext` will be rendered to `/path/to/output-dir/some/path/to/file.ext`.

But we've already seen that we can configure several asset and document directories, and that such a directory can be configured to render into a subdirectory in the output directory.


Consider this configuration:

```js
config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    })
    .addAssetsDir({
        src: 'node_modules/popper.js/dist',
        dest: 'vendor/popper.js'
    });

config
    .addDocumentsDir('documents')
    .addDocumentsDir('archive')
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-base/guide',
        dest: 'plugins/base'
    });

config.setRenderDestination('out');
```

These result in the following output directory structure:

Input dir                                    | Type   | Output location
---------------------------------------------|--------|------------------
`assets`                                     | Assets | `out`
`node_modules/bootstrap/dist`                | Assets | `out/vendor/bootstrap`
`node_modules/jquery/dist`                   | Assets | `out/vendor/jquery`
`node_modules/popper.js/dist`                | Assets | `out/vendor/popper.js`
`documents`                                  | Docs   | `out`
`archive`                                    | Docs   | `out`
`node_modules/@akashacms/plugins-base/guide` | Docs   | `out/plugins/base`

Generally speaking files in _Assets_ directories are simply copied, while the files in _Documents_ directories are rendered.

The `assets`, `documents` and `archive` directories map directly to the root of the rendered output directory.

The Bootstrap, jQuery and Popper packages together comprise what's required to use Bootstrap v4 on a website.  These three packages are distributed through the npm registry even though they do not supply Node.js code.  Instead they supply browser-side code that's available in the `dist` directory of each package.  Therefore we've mapped those `dist` directories to subdirectories of `out/vendor`.

There's a general policy among web developers to place 3rd party code into the `/vendor` directory like this.

The last item here is the documents in the `@akashacms/plugins-base` package.  This is an example of how we can draw content together from multiple sources.  In the case of the AkashaCMS project, we keep documentation for each AkashaCMS plugin in the corresponding Git repository.  That documentation is also distributed with the npm package.  That enables us to install the package, and to use the documentation on the AkashaCMS website.

But think about this, how do we convert a file name like `node_modules/bootstrap/dist/css/bootstrap-grid.css` to `out/vendor/bootstrap/css/bootstrap-grid.css`?

Consider this pair of files:

* `documents/romania/vlad-tepes/history.html.md`
* `archive/1989/ceaucescu/revolution.html.md`

The steps required to convert the file name to what's used in the rendered output directory are:

1. Strip off the directory name prefix:
    * Prefix: `documents`, Path: `romania/vlad-tepes/history.html.md`
    * Prefix: `archive`, Path: `1989/ceaucescu/revolution.html.md`
1. The policy is that the double extension, `.html.md` in this case, is converted to a single extension, `.html`, when the file is rendered.
    * Prefix: `documents`, Path: `romania/vlad-tepes/history.html.md`, Rendered: `romania/vlad-tepes/history.html`
    * Prefix: `archive`, Path: `1989/ceaucescu/revolution.html.md`, Rendered: `1989/ceaucescu/revolution.html`
1. The output directory is prepended:
    * Full Rendered: `out/romania/vlad-tepes/history.html`
    * Full Rendered: `out/1989/ceaucescu/revolution.html`

That's fairly straight-forward, yes?  The same algorithm is used for both asset and document directories.  But it does not describe what to do when a directory is mapped to a subdirectory.


Consider this: `node_modules/@akashacms/plugins-base/guide/img/toc-example.jpg`

1. Strip off the directory name prefix:
    * Prefix: `node_modules/@akashacms/plugins-base/guide/`, Path: `img/toc-example.jpg`
1. Add the directory this is mounted to:
    * Prefix: `node_modules/@akashacms/plugins-base/guide/`, Path: `plugins/base/img/toc-example.jpg`
1. Because this file type is just copied, the Rendered path is the same:
    * Prefix: `node_modules/@akashacms/plugins-base/guide/`, Path: `plugins/base/img/toc-example.jpg`, Rendered: `plugins/base/img/toc-example.jpg`
1. The output directory is prepended:
    * Full Rendered: `out/plugins/base/img/toc-example.jpg`

In other words, it's the same algorithm but with the `dest` path inserted into the correct position of the output directory path.

What happens if we have two files with the same path?

* `archive/romania/vlad-tepes/history.html.md`
* `documents/romania/vlad-tepes/history.html.md`

Which of these content files will be used to construct the output file?  The answer lies in a principle we described earlier.  Namely, the first matching file in the `documentDirs` array is used.  Because the `documents` directory appears first in `documentDirs`, it is `documents/romania/vlad-tepes/history.html.md` that will be used.

Likewise, consider these files:

* `documents/plugins/base/img/toc-example.jpg`
* `node_modules/@akashacms/plugins-base/guide/img/toc-example.jpg`

Both have the same rendered path of `plugins/base/img/toc-example.jpg`.  In this case, the copy under the `documents` directory would be used, because that directory is first.
