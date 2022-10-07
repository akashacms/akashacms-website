---
layout: blog.html.njk
title: How to create a custom static website generator in 170 lines of code
publicationDate: October 7, 2022
blogtag: news
teaser: |
    Live rebuild, rendering Markdown and AsciiDoctor, multiple template engines, in a few lines of code.
heroPicture:
    url: /news/2022/09/img/DIY-static-website-generator.png
---

This tutorial shows how to create a simple static website generator, running on Node.js, in a small amount of code.  In my understanding a _static website generator_ is an application for producing HTML, CSS, JavaScript, and other files for a website.  The result is a directory hierarchy that can be uploaded to a simple webserver, like Apache, with no server-side execution of any dynamic anything.  I say this because other people may have a different definition.

What's discussed is a demonstration application for the `@akashacms/renderers` package.  The application is called GuideCMS, and is included in the Renderers package repository.  It supports these features:

* Live rebuild of content when files are changed
* Rendering Markdown or AsciiDoctor content files
* Rendering LESS files to CSS
* Rendering templates in several formats like EJS and Nunjucks

Obviously to do all that in 170 lines of code will rely on some external packages.  The key is two sub-modules from AkashaCMS.  One, [`@akashacms/stacked-dirs`](https://npmjs.com/package/@akashacms/stacked-dirs), handles live rescanning of a directory hierarchy.  The other, [`@akashacms/renderers`](https://npmjs.com/package/@akashacms/renderers), renders files using several template engines.

The GuideCMS source code is on GitHub in the [`@akashacms/renderers` repository](https://github.com/akashacms/rendering-engines/tree/main/guidecms), look for `guidecms.mjs`.  It serves several purposes:

* Demonstrate how to create a custom static website generator that directly suits your needs.
* Show how to use `@akashacms/renderers` and `@akashacms/stacked-dirs`
* Act as a real-world test for these packages
* Handle formatting the [`@akashacms/renderers` online documentation](https://akashacms.github.io/rendering-engines/index.html)

The packages just named, along with the packages they use, provide a good foundation for a static website generator.  In fact, they are at the core of [AkashaCMS](https://akashacms.com).  While the packages were designed for AkashaCMS they were designed to be reusable in other projects, as GuideCMS also demonstrates.

## Overview of `@akashacms/stacked-dirs` and `@akashacms/renderers`

Before we dive in, let's briefly discuss what these two packages do.

Stacked Directories (`@akashacms/stacked-dirs`) is used in AkashaCMS to handle potentially complex configuration of input directories, while also handling live rebuilding of changed input files.  To support live rebuilds, the package uses Chokidar to monitor input files and to send events if files are changed or deleted.

In content management you can easily be merging content from multiple sources.  In AkashaCMS it was decided to support mapping multiple input directories into a virtual filesystem, and allow each directory to be potentially located in a different point within that filesystem.  You might have directories mapped to `/marketing`, `/support`, `/api`, and `/blog`, for example, with each being managed by different people.

Renderers (`@akashacms/renderers`) is a package encapsulating several rendering engines.  Mostly these are the popular template engines.  The concept is to have an object of one format, that is rendered to another format for use on a website.  For example LESS is suppored for easier-to-implement stylesheets which are rendered to CSS.  Both Markdown and AsciiDoctor is supported as a document format, for rendering to HTML.

The stacked directories package therefore scans the input files, sending notifications of new, changed, or deleted files, while the renderers package handles rendering input files for use on the website.

## Configuration for a CMS project

The GuideCMS example tool uses a YAML-formatted configuration file.  We use this to declare input directories, and can also declare metadata values that are supplied to all rendered templates.  The latter is used for pathnames of CSS and JavaScript files.

An example config file

```yaml
batchmode: false

dirs:
    documents:
        - mounted: documents
          mountPoint: /
        - mounted: node_modules/bootstrap/dist
          mountPoint: /vendor/bootstrap
    output: ./out
    layout: ./layouts
    partial: ./partials

metadata:
    stylesheets:
        - style.css
        - vendor/bootstrap/css/bootstrap.css
        - https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/default.min.css
    jsbottom:
        # The .bundle.js version includes Popper
        - vendor/bootstrap/js/bootstrap.bundle.js
        - https://unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js

```

There are two directories under _documents_, the first of which contain the website content.  The second contains the Bootstrap v5 distribution, which is simply copied into the rendered output directory.  Under _metadata_ we see two values, each of which is an array, containing URLs to render in the website HTML to reference CSS or JavaScript files.

In the GuideCMS source, the `js-yaml` package is used to parse the configuration file.  The values are then stored in global variables using this code:

```js
const batchmode = cfg.batchmode;
const docsDirectories = cfg.dirs.documents;
const renderedOutput = cfg.dirs.output;
const layoutsDir = cfg.dirs.layout;
const partialsDir = cfg.dirs.partial;
const metadata = cfg.metadata;
```

These values are then used throughout the rest of GuideCMS.

## Initializing Stacked Dirs

Remember that an application using `@akashacms/stacked-dirs` receives events for changes to files in directories it is to watch.

```js
const docsWatcher = new DirsWatcher('documents');

docsWatcher.on('ready', async (name) => {
    console.log(`documents ready ${name}`);
    if (batchmode) await close();
})
.on('change', async (name, info) => {
    console.log(`documents change ${name} ${info.vpath}` /*, info */);
    try {
        await render(info);
    } catch (err) {
        console.error(`documents change ERROR `, err.stack);
    }
})
.on('add', async (name, info) => {
    console.log(`documents add ${name} ${info.vpath}` /*, info */);
    try {
        await render(info);
    } catch (err) {
        console.error(`documents add ERROR `, err.stack);
    }
})
.on('unlink', async (name, info) => {
    console.log(`documents unlink ${name} ${info.vpath}`, info);
    // TODO Convert the path into a path within renderedOutput
    try {
        await fsp.unlink(path.join(renderedOutput, renderedPath(info.vpath)));
    } catch (err) {
        console.error(`documents unlink ERROR `, err.stack);
    }
});

docsWatcher.watch(docsDirectories);

async function close() {
    await docsWatcher.close();
}
```

We have created one `DirsWatcher` instance to watch the directories listed in the `documents` array.  The code watches four events, and takes appropriate action for each.  When its time to shut down the script, the `close` function is called, which causes DirsWatcher to stop listening for events, which causes the Node.js event loop to exit, causing the script to exit.

FOr `change` and `add` events the `render` function is called.  This function handles page layout by rendering a content file, then rendering that content into a page layout template.  But, before we get to that we must discuss how to initialize the Renderers package.

## Initializing Renderers

For GuideCMS to be a CMS, it must render the files used in the website.  With the Stacked Dirs package, GuideCMS receives a list of input files.  For every input file, the `render` function is called, which uses the Renderers package to convert such files for use on the website.

This requires that we initialize the Renderers package.

```js
const renderers = new Renderers.Configuration({
    partialDirs: partialsDir ? [ partialsDir ] : undefined,
    layoutDirs: layoutsDir ? [ layoutsDir ] : undefined
});
```

The `renderers` object will contain the Renderers configuration used in GuideCMS.

The Configuration class can be initialized from an object passed to the constructor, as shown here.  In this case we pass in the partials directory, and layouts directory.  It can also be configured, or reconfigured, via several methods for changing other configuration settings.

The Renderers package includes support for rendering both Markdown and AsciiDoctor documents.  For Markdown, there is a default configuration that works well, but we can also do customizations.

```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const rendererMarkdown = renderers.findRendererName('.html.md');

rendererMarkdown.configuration({
    html:         true,     // Enable html tags in source
    xhtmlOut:     false,    // Use '/' to close single tags (<br />)
    breaks:       false,    // Convert '\n' in paragraphs into <br>
    linkify:      true,     // Autoconvert url-like texts to links
    typographer:  false,    // Enable smartypants and other sweet transforms
})
.use(require('markdown-it-highlightjs'), { auto: true, code: true, inline: true })
.use(require('markdown-it-expand-tabs'), { tabWidth: 4 });
```

This is an optional configuration of the Markdown renderer.  Because the Renderers package guide uses many code snippets, it's useful for them to have syntax highlighting.  This configuration adds syntax highlighting using the Highlight.JS package.

Because GuideCMS is implemented in `guidecms.mjs`, it is in ES6 format, and the CommonJS `require` function is not available.  The `createRequire` function generates a `require` function letting us use `require` to load a CommonJS package.

Next we use `findRendererName` to access the Renderer instance for Markdown.  For the MarkdownRenderer class, we have two options for its configuration.  First, the `configuration` method passes in Markdown configuration.  Second, the `use` method allows use of Markdown-IT plugins.

The GuideCMS configuration file shown earlier loads the CSS and JS for using Highlight.JS.  Adding the `markdown-it-highlightjs` plugin causes the Markdown renderer to emit markup for highlighting.

## Render function to handle page layout

We can now look at the `render` function.  For this function we're supporting a two stage process, where the application renders the content file, then it can render the content into a page layout template.

```js
async function render(info) {

    // Read file content
    // Find the renderer
    // Ask the renderer to parse metadata
    // render content
    // If the metadata includes a layout
    //     read the layout file
    //     duplicate the previous metadata
    //     add rendered content to new metadata
    //     render
    // Write rendered content to a file 
    // whose name is computed from input file

    const renderer = renderers.findRendererPath(info.vpath);
    if (!renderer) {
        const copyTo = path.join(renderedOutput, info.vpath);
        console.log(`COPY ${info.vpath} to ${copyTo}`);
        await fsp.mkdir(path.dirname(copyTo), { recursive: true });
        await fsp.copyFile(info.fspath, copyTo);
        return;
    }
    // Create RenderingContext object
    let context = {
        fspath: info.fspath,
        content: await fsp.readFile(info.fspath, 'utf-8')
    };
    context = renderer.parseMetadata(context);
    if (context.metadata) {
        context.metadata = copyMetadataProperties(context.metadata, metadata);
        context.metadata.partial = async (fname, metadata) => {
            return renderers.partial(fname, metadata);
        };
        context.metadata.partialSync = (fname, metadata) => {
            // console.log(`partialSync ${renderers.partialSync} ${fname}`);
            return renderers.partialSync(fname, metadata);
        };
    }
    // console.log(`vpath ${info.vpath}`, context);
    let rendered;
    try {
        rendered = await renderer.render(context);
    } catch (err) {
        throw new Error(`Failed to render ${info.vpath} because ${err}`);
    }

    // console.log(`rendered`, rendered);

    let layoutRendered;
    if (!context.metadata || !context.metadata.layout) {
        layoutRendered = rendered;
    } else {
        const layoutFN = await renderers.findLayout(context.metadata.layout);
        let layoutContext = {
            fspath: layoutFN,
            content: await fsp.readFile(layoutFN, 'utf-8'),
            metadata: copyMetadataProperties({}, context.metadata)
        };
        layoutContext.metadata = copyMetadataProperties(
            layoutContext.metadata, metadata
        );
        delete layoutContext.metadata.layout;
        layoutContext.metadata.content = rendered;
        const layoutRenderer = renderers.findRendererPath(layoutFN);
        // console.log(`layout context `, layoutContext);
        try {
            layoutRendered = await layoutRenderer.render(layoutContext);
        } catch (err) {
            throw new Error(`Failed to render ${layoutFN} with ${info.vpath} because ${err}`);
        }
    }
    
    const renderTo = path.join(renderedOutput, renderer.filePath(info.vpath));
    await fsp.mkdir(path.dirname(renderTo), { recursive: true });
    console.log(`RENDER ${info.vpath} ==> ${renderTo}`);
    await fsp.writeFile(renderTo, layoutRendered, 'utf-8');
}
```

The `info` object comes from the Stacked Dirs package which supports combining several directories into one virtual filesystem.  See [](/news/2021/06/stacked-dirs.html).  Where `info.vpath` is the virtual pathname within the `documents` directory hierarchy, `info.fspath` is the absolute pathname in the filesystem.

The `findRendererPath` method locates the correct Renderer based on the pathname.  Each Renderer instance uses one or more regular expressions for matching pathnames.  For example, a pathname ending in `.html.ejs` says the file is to be processed as an EJS template, that it produces HTML output, and that the output file name has the `.html` extension.  Likewise, `.html.njk` says the file is a Nunjucks template, producing HTML output, and the file name is to have the `.html` extension.

If no renderer is found, then the file should be copied into the output directory.  The root of the output directory is in `renderedOutput`, so therefore the full pathname is computed with `path.join` using `info.vpath`.

Next the code creates a RenderingContext object.  This object is used by several methods in the Renderer class for holding the data related to one rendering transaction.

The `RenderingContext` type is defined this way:

```js
export type RenderingContext = {
    fspath?: string;  // Pathname that can be given to template engines for error messages
    content: string;  // Content to render
    body?: string;    // Content body after parsing frontmatter
    metadata: any;    // Data to be used for satisfying variables in templates
};
```
As you can see this is a simple object with sensible fields.  This function begins the object with the absolute pathname of the input file, as well as its content.

The `parseMetadata` will, if the Renderer supports metadata in files, parse out any data in the input file.  Most of the Renderer's support YAML frontmatter which is structured like this:

```html
---
title: Page title goes here
layout: layout-template-file-name.html.ejs
---

Input content body
```

The first portion, between `---` lines, is the frontmatter, and is in YAML format.  You can use the full panoply of YAML features, if desired.  The remainder of the file is what is assigned to the `body`, and the parsed form of the frontmatter block is assigned to `metadata`.

At this point `context` should have data in all four fields.

The `copyMetadataProperties` is used to copy additional values into the metadata object.  It is defined as:

```js
function copyMetadataProperties(data, metadata) {
    try {
        for (const prop in metadata) {
            if (!(prop in data)) data[prop] = metadata[prop];
        }
        return data;
    } catch (err) {
        throw new Error(`Failed to copy metadata because ${err}`);
    }
}
```

Because metadata can be declared in the configuration file, the code needs to merge the metadata in the file with the global metadata.

We also add to `context.metadata` two functions, `partial` and `partialSync`.  These support rendering partial templates, which allow us to create web content snippets that can be easily reused between page layouts.

The `render` method renders the data in `context` into the output data supported by the Renderer.  There is also a `renderSync` method which is used when execution is synchronously constrained.

That completes the first rendering stage.  A typical case is that Markdown content has been rendered into HTML, but the HTML needs to be embedded into the page layout used by the website.  In such a case the second rendering stage is used.  In other cases, such as rendering a LESS file to CSS, there is no metadata, and there is no second rendering stage.

The second stage is executed only if there is a layout template specified in the metadata.

The `findLayout` method searches the layout directories for a matching template.  A RenderingContext object is then constructed for the second stage.

The metadata in this case is created by merging a duplicate of the metadata in the input file with the global metadata.  In that metadata, the `layout` field is deleted because it's no longer needed, and the first stage rendered content is assigned as the `content` field.

The layout template must insert the `content` variable into the designated location.

The `findRendererPath` method is called to retrieve the Renderer to be used for the layout template.  And the code then renders the template into the `layoutRendered` variable.

Finally we get to the bottom of the function where the rendered content is written to the output file.  The output file name is computed slightly differently this time.  The Renderer method `filePath` tells us the pathname to use for the input file name.


## Simple layout template

In the previous section we discussed using a page layout template for the second stage of rendering. Every website will use the same, or similar, page structure on every page. The second rendering stage lets us define one or more layout templates for that purpose.

This is a simple example using Nunjucks template syntax:


```html
<html>
    <head>
        <title>{{ title | escape }}</title>
        {% for style in stylesheets %}
        <link rel="stylesheet" type="text/css" href="{{ style | escape }}"/>
        {% endfor %}
    </head>
    <body>
        <h1>{{ title | escape }}</h1>
        <article>
            {{ content }}
        </article>

        {% for js in jsbottom %}
        <script src="{{ js | escape }}"></script>
        {% endfor %}

        <script>
            try {
                hljs.initHighlightingOnLoad();
            } catch (err) { }
        </script>
    </body>
</html>
```

Remember that the content rendered in the first rendering stage is assigned to the `content` variable of the metadata supplied in the second rendering stage.  In this template you see the `content` variable is rendered into the body of the `<article>` tag.

For the arrays in `stylesheets` and `jsbottom`, tags are rendered referencing the CSS or JavaScript files.  There is also a hard-coded JavaScript piece useful for HighlightJS.

An alternate version of this is:

```html
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ title | escape }}</title>
        {{ partialSync('stylesheets.html.njk', {
            stylesheets: stylesheets
        }) }}
        {{ partialSync('jshead.html.njk', {
            jshead: jshead
        }) }}
    </head>
    <body>
        <head class="container-fluid">
        <h1>{{ title | escape }}</h1>
        </head>
        <div class="container-md">
            <div class="row">
                <article class="col">
                    {{ content }}
                </article>
                <section class="col-2">
                    {{ partialSync('sidebar.html') }}
                    {# {% include 'sidebar.html' %} #}
                </section>
            </div>
        </div>

        {% include 'footer.html' %}
        
        {% include 'jsbottom.njk' %}
        {% include 'hljs-init.html' %}
    </body>
</html>
```

This version pushes some of the HTML snippets to partial templates.  Hence, on a complex website with multiple page layouts we can easily reuse these snippets between pages.  The `partialSync` function is supplied by the Renderers package, while the `include` tag is supplied by Nunjucks.

Because this is a Nunjucks template, we make sure the content is safely encoded using the `escape` filter.

Remember that GuideCMS was created for the documentation website of the Renderers package.  That page layout template uses Bootstrap v5 classes to format a mobile responsive multi-column layout with a nice looking navigation sidebar.  Implementation requires installing Bootstrap code, adding the URLs to the `stylesheets` and `jsbottom` arrays, and some more work on the layout template.

## Writing content

We've seen how GuideCMS works, let's now turn to putting it to use.

Remember that in in [the `@akashacms/renderers` repository](https://github.com/akashacms/rendering-engines), the `guide` directory is a working example of a website built using GuideCMS.  It will probably be the only website built using GuideCMS, for that matter.

The _architecture_ (if we're allowed to use such an august word) of GuideCMS is to have three sets of directories: _documents_, _layouts_, and _partials_.  The first directory contains documents, the information which is rendered into pages on the website.  The second contains page layout templates, and the last contains partial templates.  The architecture allows for more than one instance of each type of directory.

The first step of writing content is to create one or more page layout templates.  You may find it useful to create some partial templates, for succinct layout templates, and to share code between layout templates.  With the templates created, it's time to write some documents.

The _documents_ directories correspond to files to be created in the rendered output directory.  Remember that the `renderTo` path was created with this line of code:

```js
const renderTo = path.join(renderedOutput, renderer.filePath(info.vpath));
```

A file `documents/history/romania/vlad-tsepes.html.md` will therefore render to `out/history/romania/vlad-tsepes.html`.

There is a slight wrinkle to this, in that documents directory can be mounted at positions within the virtual directory hierarchy.  This is the _documents_ configuration actually used for the actual guide documentation website:

```yaml
documents:
    - mounted: documents
      mountPoint: /
    - mounted: node_modules/bootstrap/dist
      mountPoint: /vendor/bootstrap
```

The website uses Bootstrap v5 for responsive layout.  The Bootstrap package available via NPM is installed, meaning that the Bootstrap code is in the directory named in the configuration.  The config says that those files are to be treated as if they are in the virtual directory `/vendor/bootstrap`, whereas the files in `documents` are to be treated as if they are in the root directory.

The documents directories contain files that might be rendered, while the other directories contain templates that will be used during rendering.

The format of a Markdown content file is:

```md
---
title: Metadata test for Markdown
layout: foo.html.ejs
hello: world
---

# This is an H1 header

Hello, World!
```

The first part, between the `---` lines, is the frontmatter and contains the metadata described earlier.  In this case there is a `title`, `layout`, and an extra value named `hello`.  Your application can use any data it wants in the frontmatter.

Refer to the code we discussed earlier, the rendered result will be like this:

```html
<h1>THis is an H1 header</h1>
<p>Hello, World!</p>
```

And, there will be a metadata object.  The two will then be converted into the `layoutContext`, and the content rendered using the `foo.html.ejs` template.

## Running GuideCMS in dynamic watching mode and in batch mode

GuideCMS supports two modes of operation: _batch_ and _dynamic_.  In the latter it will respond to any file change, and re-render the changed files.  In batch mode, it will instead render all files and immediately exit.

The mode is determined by this configuration file value:

```yaml
batchmode: false
```

Change it to `true` to get batch mode.

In the Guide directory there is a `package.json` containing this:

```json
"scripts": {
    "watch": "npm-run-all --parallel watcher preview",
    "preview": "live-server out",
    "watcher": "node ../guidecms/guidecms.mjs cfg.yml",
    "build": "node ../guidecms/guidecms.mjs cfg-batch.yml",
    "publish": "npx gh-pages -d out"
},
```

The `watch` script starts two programs running in parallel.  The `preview` script watches the rendered output directory, noticing changes, and dynamically reloading any browser window that has an open page.  The `watcher` script starts GuideCMS in dynamic mode, where it automatically rebuilds any changed pages.  When a page is changed, `live-server` notices the change and auto-reloads the web page.

The `build` script builds the site in batch mode, and exits when all files have been built.

The `publish` script handles publishing the built site to GitHub Pages.

These scripts make it very easy to write content using GuideCMS.  You start the `watch` commands, which opens a browser tab on the site.  Then in an editor like Visual Studio Code, you write Markdown content.  Every time you save a change, the browser tab will quickly reload.  It's almost as good as a WYSIWYG editor, but you're writing Markdown.

## Summary

GuideCMS is intended to be a demonstration of using these packages.  It is a proof of concept that one can easily implement a relatively powerful static website generator.

There are of course a number of things missing from GuideCMS, since there's only so much you can cram into a couple hundred lines of code.  For example, AkashaCMS is built on top of the same two components, and has many other features.

The `@akashacms/stacked-dirs` package provides dynamic events of changes to files in the filesystem, while allowing a fairly complex structure of overlapped directory hiearchies mounted into a virtual filesystem.  The `@akashacms/renderers` package encapsulates several useful template engines and other web development tools.  It is easy to create Renderer implementations to support other engines or tools.  It is easy to integrate these packages into one application, and to add on other logic to suit whatever application you envision.


