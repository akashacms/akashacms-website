---
layout: blog.html.njk
title: Stacked Directories - A directory/file watcher for static website generators
publicationDate: June 17, 2021
blogtag: news
teaser: |
    It's very convenient when a static website generator can automatically watch the source files, automatically rebuilding any changed pages, and automatically updating a browser tab.  Having the web page automatically rebuilt is almost as good as a WYSIWYG editor.  Some statically generated website projects require complex directory configurations.  A new Node.js package, spun off from the AkashaCMS project, aims to support such complex directory relationships, while automatically watching files in those directories, and emitting events that can drive automated rebuilding of changed or added files.
heroPicture:
    url: /news/2021/06/img/stacked-dirs.jpg
    caption: Stacked directories are useful for some static website generator applications.  Image by David Herron.
---

I began AkashaCMS development in 2013 [with the goal of supporting a high traffic website on low end shared hosting, while using modern JavaScript and CSS techniques](/news/2014/04/static-html-website-builder.html).  Missing from the long list of features was the ability to automatically rebuild pages to get a full fledged preview and to detect errors early.  Implementing that feature led to a major rewrite to AkashaCMS, with the core being a new standalone module that could be used by any static website generator.

That module, _Stacked Directories_, handles complex directory hierarchy relationships, the ability to override files, and automated scanning for changes (additions, changes and deletions) in directory hierarchies.  In use, the application supplies a list of directories to watch and their relationship to locations in the _rendered output directory_.

The scope of the _Stacked Directories_ module is

* Being configured with one or more directories whose files to watch
* An order of precedence between directories, such that a given file can exist in multiple directories, and the file to use is in the directory with the highest precedence
* Locating directories within a virtual filesystem space
* Detecting changes to files, addition of new files, and deletion of existing files, emitting corresponding events

What we mean by _virtual filesystem space_ is the directory into which a statically generated website is constructed.  Some such projects require aggregating content from multiple source directories, where some are meant to be rendered into a subdirectory of the website

This package does not support rendering content into HTML/CSS/etc, nor does it include a feature for automatically reloading a browser after a page is rebuilt.  Instead it is meant for _Stacked Directories_ to be built into a larger system that has these and other features.  Inside the _Stacked Directories_ repository is a sample static website generator, called SimpleCMS, that shows one way to use this package to support automatically rebuilding website content.

# Overriding any file in static website project configuration

The image above shows one core feature of _Stacked Directories_.  It comes from a core principle in AkashaCMS, namely that each file can be overridden.  But, what does that mean?

Consider a module for implementing Blogs within a website.  One feature of blogs is an index presented in reverse chronological order (the _River of News_ for the blog).  This mean the blog module would include templates to assist formatting blog post content, the _River of News_ and other blog paraphernalia.  The question is, how can the static website generator support customizing those templates?  A theme package might want to customize those templates, as might the website owner.

That's where file overriding comes into play.

In AkashaCMS there is four stacks of directories:  a) _documents_ are where the document files live, b) _assets_ are files like images or CSS or JavaScript which are simply copied into the output directory, c) _layouts_ are for templates covering the whole page, and d) _partials_ are for templates used in formatting specific elements.  The theming task just described is handled with _partial templates_.

The image above describes the _partials_ directory stack and the role of one file, `news-river.html.njk`.  This template is written using Nunjucks syntax, and has something to do with formatting a _River of News_.  In this image each box is one directory in the _partials_ directory stack.  The top-most box in this image could be the website itself.  The second box could be a packaged theme supplying theme-specific implementations of templates supplied by other plugins.  The fourth box could be the blogging module.  That module supplies the default `news-river.html.njk` template, while the both the theme module and the website override it with their own implementation.

What's reported to the application is the top-most file in the stack.

That's one use-case, overriding files to support customizability.

# Assembling static website content from multiple sources

Another use case is to assemble content from several sources.  The marketing team, the technical publications team, the support team, all have content to display on the website.  But each team has its own management, and its own schedule, and will likely have its own Git repository to store the content files.  Those thoughts led to another concept:

<img figure src="./img/multiple-sources.jpg"
    caption="Virtual path hierarchy.  Image by David Herron"/>

A statically generated website will be rendered into an output directory.  We treat that directory as a _virtual_ path hierarchy, with different source directories in effect being _mounted_ onto a position in this virtual hierarchy.  The source directory for `/news`, for example, does not need to be named `news` and can have any name.  The rendering system should arrange for the rendered files to land into the `news` directory of the rendered output directory.

A related example is the front-end frameworks used on a website.  For example, the Bootstrap framework in turn requires PopperJS, and you might want to use an icon library like Font Awesome.  Each framework has its own distribution that needs to land in directories like `/vendor/bootstrap` or `/vendor/fontawesome`.

The last feature to consider is to watch the files, to automatically rebuild anything which changes, and to automatically update a web browser tab with the rebuilt content.  Clearly such a feature needs to navigate the various directories involved, mapping files to the correct location while rendering, doing everything at lightning speed because modern humans are very impatient and want everything right now.

The AkashaCMS sub-project, Stacked Directories, aims to handle tracking files to support the needs just described.  It was designed for use in AkashaCMS, but can be used by any other project.  Heck, it might even be useful for applications other than static website generators.

# Installing the _Stacked Directories_ package

The _Stacked Directories_ package is only published via the _npm_ repository.  Hence, installation into a Node.js project is:

```
$ npm install @akashacms/stacked-dirs --save
```

Feel free to transliterate this command to your preferred package manager, like Yarn.

Source code is at:  https://github.com/akashacms/stacked-directories

Project documentation: https://akashacms.github.io/stacked-directories/

# Configuring a directory/file watcher instance

Now that we have it installed in a project directory, let's see how to use the Stacked Directories module.

To begin with, in Node.js source code:

```js
import { DirsWatcher } from '@akashacms/stacked-dirs';
...
const docsWatcher = new DirsWatcher('documents');
```

`DirsWatcher` is a Class containing the the code, and behind the scenes it manages a _Chokidar_ instance.  You create as many instances of this class as needed by your application.  For example, AkashaCMS uses four instances, one to track Document files, another to track Assets, another to track Page Layout Templates, and the last to track Partial Templates.  The string passed to the constructor, in this case `documents`, serves as the name of this DirsWatcher instance.  The class doesn't do anything with the name, so you can use this in any way you like.

By itself the DirsWatcher instance does not do anything.  That means it does not start watching any directories, until it is told which directories to watch, which we have not yet done.  Once you've supplied a list of directories, it will begin scanning those directories, and emitting events.  We'll go over the events in the next section.

The structure one must follow is:

```js
import { DirsWatcher } from '@akashacms/stacked-dirs';
...
const docsWatcher = new DirsWatcher('documents');

// Configure event listeners -- see next section

docsWatcher.watch([
    // list of directory descriptors
]);
```

The _watch_ method is where we supply the list of directories to watch.  In order to catch all events, it is necessary to set up the event listeners before calling _watch_.

Each directory descriptor is an object with some or all of these fields:

* `mounted` - The file system directory to reference
* `mountPoint` - The location within the virtual file space
* `ignore` - One or more "glob" patterns indicating files to ignore

For example:

```js
assetsWatcher.watch([
{ 
    mounted: 'assets', mountPoint: '/',
    ignore: [
        '**/.DS_Store',
        '**/.placeholder'
    ]
},
{ mounted: 'node_modules/bootstrap/dist', mountPoint: 'vendor/bootstrap' },
{ mounted: 'node_modules/jquery/dist',    mountPoint: 'vendor/jquery' },
{ mounted: 'node_modules/popper.js/dist', mountPoint: 'vendor/popper.js' }
]);
```

This has four entries, and shows how each field is used.

* The _mounted_ field is a location in the filesystem, and can either be relative or absolute.
* The _mountPoint_ field is a location within the virtual file space
* A _mountPoint_ value of `/` means this directory is _mounted_ on the root of the virtual space.
* The _ignore_ field lists "glob" patterns for files to ignore.  This type of pattern is used in many tools, for the precise format look at the Minimatch package for Node.js.

This example demonstrates mounting directories into a virtual space.  But it doesn't explicitly demonstrate directory stacking.  Consider what happens if these files existed:

Mounted                       | File | Virtual path
------------------------------|------|-------------
`assets`                      | `vendor/bootstrap/bootstrap.min.js` | `vendor/bootstrap/bootstrap.min.js`
`node_modules/bootstrap/dist` | `bootstrap.min.js` | `vendor/bootstrap/bootstrap.min.js`

This is two directories in our list containing files with the same virtual path.  The virtual path is computed by concatenating the _mountPoint_ value to the path within the directory.  But, you might be wondering just what is a virtual path?

The _virtual path_ is not a path in a source directory in the filesystem.  Instead, it is the path within the _rendered output directory_.  The rendered output directory is what will ultimately be deployed to the server.  There is one aspect of the virtual path which is **not** handled in _Stacked Directories_, and this is the file name conversion which happens while rendering the file.  For example, a Markdown file has the extension `.md` but is rendered to a file with the `.html` extension.  But it was decided that was out-of-scope for _Stacked Directories_ to know the conversion algorithm, because it does not render the files.

What Stacked Directories will do is to find all files with the same virtual path, and report on them together.  The object, which we'll discuss later, shows the first matching file as the primary result, and elsewhere it lists all matching files.

The file in `assets`, in this example, can be said to _hide_ or _overlay_ the file in `node_modules/bootstrap/dist`.

The more explicit directory stacking demonstration would involve putting the following at the front of the above array:

```js
{ 
    mounted: 'assets-overlay', mountPoint: '/',
    ignore: [
        '**/.DS_Store',
        '**/.placeholder'
    ]
}
```

In this case you have two directories on the same mount point.  Because the `assets-overlay` directory is in front of `assets`, its files will hide any corresponding file in `assets`.

# Events emitted by DirsWatcher instances

Now that we've seen how to configure Stacked Directories, let's talk about the events emitted from DirsWatcher instances.

The DirsWatcher class is a subclass of EventEmitter.  That means it has all the familiar methods for emitting events, and for applications to subscribe to those events.

The full recommended application structure is:

```js
const watcher = new DirsWatcher('watcher-name');

watcher.on('change', (name, vpinfo) => { ... });
watcher.on('add', (name, vpinfo) => { ... });
watcher.on('unlink', (name, vpinfo) => { ... });
watcher.on('ready', (name) => { ... });

await watcher.watch([ ... ]);
```

In other words there are, currently, four events:

* `add` -- DirsWatcher has seen a newly added file in a watched directory
* `change` -- DirsWatcher has seen a change in an existing file in a watched directory
* `unlink` -- DirsWatcher has detected an existing file is no longer there
* `ready` -- DirsWatcher has finished its initial scan of the watched directories

The _initial scan_ happens when the DirsWatcher instance is first started.  It scans the directories, and emits `add` events for each file it finds.  Once it has scanned all files, it emits a `ready` event.  Afterward it only emits events if a new file is added, an existing file is changed, or deleted.

The `vpinfo` object contains a predigested data object describing the file stack for a given file.  Here's an example:

```js
{
  fspath: 'documents-overlay/affiliate.html.md',
  vpath: 'affiliate.html.md',
  mime: 'text/markdown',
  mounted: 'documents-overlay',
  mountPoint: '/',
  pathInMounted: 'affiliate.html.md',
  stack: [
    {
      fspath: 'documents-overlay/affiliate.html.md',
      vpath: 'affiliate.html.md',
      mime: 'text/markdown',
      mounted: 'documents-overlay',
      mountPoint: '/',
      pathInMounted: 'affiliate.html.md'
    },
    {
      fspath: 'documents-example/affiliate.html.md',
      vpath: 'affiliate.html.md',
      mime: 'text/markdown',
      mounted: 'documents-example',
      mountPoint: '/',
      pathInMounted: 'affiliate.html.md'
    }
  ]
}
```

In this case the file `affiliate.html.md` appears in two directories in the stack.  The top-level elements describe the front-most entry of the stack.  The `stack` field contains description of every file in the stack.

The fields mean:

* `fspath` -- This is the pathname in the host filesystem
* `vpath` -- The path within the virtual filesystem
* `mime` -- The MIME type for the file
* `mounted` -- The _mounted_ field of the directory entry where this file was found.
* `mountPoint` -- The virtual filesystem location where _mounted_ appears
* `pathInMounted` -- The filename relative to the `mounted` directory
* `stack` -- The full list of files in all directories that have the same `vpath` value

Earlier we said that DirsWatcher does not compute the rendered virtual path.  That computation must be handled in the application.  In AkashaCMS, the class which receives DirsWatcher events computes the rendered virtual path, adding it as the `renderedPath` field.

# SimpleCMS - A simple static website generator built in a couple hours using DirsWatcher

To finish this up, let's see how DirsWatcher would be used in an application.  It is being used in AkashaRender, the core of AkashaCMS, but there's too much code there to make an effective example.  Instead, in the Github repository you'll find _SimpleCMS_, which is an ultra-trimmed-down static website generator.  This example was built in a couple hours and serves as a tool for ad-hoc testing of DirsWatcher.

In the repository you find a directory named `test`, and another named `example`.  The `test` directory has a normal unit test suite, which includes some directories of sample files.  The `example` directory contains `simplecms` which is the implementation of SimpleCMS, as well as `project` which is a partial project which we can render using SimpleCMS.

In `example/simplecms/index.mjs` find the following code:

```js
import { DirsWatcher } from '@akashacms/stacked-dirs';
// import { DirsWatcher } from '../../lib/watcher.mjs';
import path from 'path';
import { promises as fs } from 'fs';
import { render, renderedPath } from './render.mjs';
import yaml from 'js-yaml';
```

This imports the required packages and functions.  You'll notice there are two lines for importing _DirsWatcher_.  In the actual example code you'll find the second of those two, but in a regular application you'll find the first.

There is a module we won't discuss in this article, `render.mjs`, that contains a simple rendering engine.

```js
// Read the configuration from a YAML file

if (process.argv.length < 2 || !process.argv[2]) {
    console.error('USAGE: node index.mjs config.yaml');
    process.exit(1);
}

let ymltxt = await fs.readFile(process.argv[2], 'utf8');
let cfg = yaml.load(ymltxt);

let batchmode = cfg.batchmode;

const docsDirectories = cfg.dirs.documents;

export const renderedOutput = cfg.dirs.output;
export const layoutsDir = cfg.dirs.layout;
export const partialsDir = cfg.dirs.partial;

// Do initializations in the Render module
import { init } from './render.mjs';
init(layoutsDir, partialsDir);

////////////// END OF CONFIGURATION SECTION
```

This reads a YAML file, that must be named on the command line, which will contain configuration settings.  This section ends by calling the `init` function in `render.mjs`.  That module contains code for rendering files.  Because this article is focusing on using DirsWatcher, we won't show what's in that file.

```js
const docsWatcher = new DirsWatcher('documents');

docsWatcher.on('ready', async (name) => {
    console.log(`documents ready ${name}`);
    if (batchmode) await close();
})
.on('change', async (name, info) => {
    console.log(`documents change ${name} ${info.vpath}`, info);
    try {
        await render(info);
    } catch (err) {
        console.error(`documents change ERROR `, err.stack);
    }
})
.on('add', async (name, info) => {
    console.log(`documents add ${name} ${info.vpath}`, info);
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
        await fs.unlink(path.join(renderedOutput, renderedPath(info.vpath)));
    } catch (err) {
        console.error(`documents unlink ERROR `, err.stack);
    }
});

docsWatcher.watch(docsDirectories);

async function close() {
    await docsWatcher.close();
}
```

This is where we configure and use the DirsWatcher instance.

SimpleCMS has a very simplified view of the world, as reflected by there being only one DirsWatcher instance.  This instance is used to track document files.  For page layout templates and other templates, those are single directories named in the `layoutsDir` and `partialsDir` variables.

The next thing to notice is the response to events.  For both _add_ and _change_ events, it simply calls the `render` function.  However, for _unlink_ events it deletes the corresponding file from the rendered output directory.  Finally, for _ready_ events it closes the DirsWatcher, if in _batch_ mode, and the side effect of this is to cause the script to exit.

In a more fully featured CMS you might approach this differently.  For example it's useful to save the data into an index, one purpose being to allow the rendering of one page reference data stored in another page.  Also, instead of simply invoking the `render` function, there should be a _Worker Queue_ employed to ensure the amount of simultaneous work does not swamp the system.

The _add_ and _change_ events mean there is either a new content file, or a changed content file, which we must render into a file in the output directory.

In DirsWatcher, these events are not triggered for every addition or change.  Instead, they're only triggered if the addition or change is for the front-most file in the directory stack.  Consider the `affiliate.html.md` example shown earlier.  The file in `documents-overlay` is the front-most file in the stack.  There are four scenarios of interest:

1. The file `documents-overlay/affiliate.html.md` changes, in which case the _change_ event is triggered.
1. There is a directory in the stack with higher precedence than `documents-overlay`, in which a file named `affiliate.html.md` is added.  In this case the _add_ event is triggered.
1. The file `documents-example/affiliate.html.md` is changed.  In this case it is not the front-most file in the stack, and therefore no event is triggered.
1. Another directory is in the stack at lower precedence than `documents-overlay`, in which a file named `affiliate.html.md` is added.  In this case no event is triggered, because that new file is not the front-most file in the stack.

The `render` function primarily is about converting a file (like a Markdown file) into a format useful in a website.  It supports both Markdown files, rendering to HTML, optionally with a layout template.  It also supports compiling LESS files to CSS.  The `render` function also supports simply copying a file into the rendered output directory, because not all file types require conversion.

The _unlink_ event requires some deeper thought.  Suppose your directory stack has two files for a given virtual path, like the `affiliate.html.md` example shown earlier.  There are three scenarios to consider:

1. The file `documents-overlay/affiliate.html.md` is deleted.  In this case the file `documents-example/affiliate.html.md` is now the front-most file in the stack.  You could say that this file has been unveiled or unhidden.  The result is that a _change_ event is triggered, showing `documents-example/affiliate.html.md` as the primary file.
1. The file `documents-example/affiliate.html.md` is deleted.  In this case it is not the front-most file in the stack, and no event is triggered.
1. If there is only one file in the stack, and that file is deleted.  In this case there are no other files with the same virtual path, and therefore an _unlink_ event is triggered.

We see in the unlink handler a function, `renderedPath`, being called.  This function takes a virtual path name (`vpath`) and converts it to the pathname for that file in the output directory.  For example a `vpath` of `epub/chap5/b/chap5b.html.md` must become `epub/chap5/b/chap5b.html` in the output directory.  Specifically, this function rewrites the basename portion of the path (the part after the last slash) using the following algorithm:

Extension | Result
----------|-----------
`path/to/file.html.md` | `path/to/file.html`
`path/to/file.md` | `path/to/file.html`
`path/to/file.css.less` | `path/to/file.css`
`path/to/file.less` | `path/to/file.css`

The double-extension pattern (`.html.md`) is because that's the file name pattern used in AkashaCMS.  The idea was to document in the file name the format of the file, and the output format.

The last event to discuss is _ready_.  As said earlier, this event is triggered when the initial file scan is completed.  The result is that an _add_ event has been sent for every file in every directory in the stack.

If the goal of your application is to constantly watch for files to rebuild, then your DirsWatcher instance should simply continue running.  But, if the goal is to simply build the website then exit, the _ready_ event is a good time in which to consider exiting the process.  With SimpleCMS, the _render_ function has been called for all files, and therefore all files have been rendered or copied into the output directory.

The implementation calls `DirsWatcher.close`, the effect of which is to shut down the module that watches for file changes (Chokidar).  The Node.js process will continue executing so long as there are active event listeners.  What this means is that as soon as all calls to `render` finish executing, there will be no more event listeners, and Node.js will exit.

# Running a simple SimpleCMS example

In the Stacked Directories repository there are several directories of test files.  In the `example/simplecms` directory we have a configuration file listing those test directories as input directories.  Namely:

```yaml
# batchmode: false   # For continuous execution
batchmode: true

dirs:
    documents:
        - mounted: '../project/documents-overlay'
          mountPoint: '/'
        - mounted: '../../test/documents-example'
          mountPoint: '/'
        - mounted: '../../test/documents-epub-skeleton'
          mountPoint: 'epub'
    output: ../project/out
    layout: ../project/layouts
    partial: ../../test/partials-base
```

This configuration object directly corresponds to the code shown earlier.

In `example/simplecms/package.json` you find this `scripts` section:

```json
"scripts": {
    "start": "node index.mjs"
},
```

With this, we can run SimpleCMS by running `npm start`, but we have to do this to avoid it crashing:

```
$ npm start -- cfg.yaml
```

With npm, anything after the `--` is appended to the executed command line.  Therefore this is equivalent to running `node index.mjs cfg.yaml`, with the advantage that `package.json` remembers the command string for you.

With this configuration the document files come from the named directories.  The `documents-overlay` directory is meant to let us experiment with overlaying files to learn how this works.  The `documents-epub-skeleton` directory instead shows mounting into a subdirectory.

The rendering will be output to `project/out`, and the `project/layouts` directory contains layout templates.  The various subdirectories of the `test` directory contain files formatted for AkashaCMS projects, and they won't be directly useful with SimpleCMS.

Lastly, because `batchmode` is set to `true`, the command will read all the files, render them, then exit.

If you run this once, you'll see a tracing showing the _Add_ events, followed by a call to _renderMarkdown_.  This happens for every file, and then quickly it finishes and you're at the command-line.  The newly created `out` directory contains `.html` files and it will be instructive to inspect them.  It's useful to compare the template, and the content file, against the output file.

Study `test/documents-example/markdown.html.md`, for example.  At the top is this:

```
---
layout: default.html.ejs
title: Markdown example
tags: Markdown
---
```

This _Frontmatter_ is a YAML-formatted block that's parsed using the Grey-Matter package.  The `layout` tag declares which layout template to use.  The other lines end up as metadata that is supplied when the layout template is rendered.  Currently SimpleCMS supports either EJS or Nunjucks templates.

The body of this file is a standard Markdown test document that exercises most of Markdown's features.  You'll find in `project/out/markdown.html` the resulting template, which you can compare against the `default.html.ejs` template to see how it all fits together.

To switch to continuous rendering mode, make this change in `cfg.yaml`:

```yaml
batchmode: false   # For continuous execution
# batchmode: true
```

This changes the response to the _Ready_ event such that the DirsWatcher instance is not closed.  That causes SimpleCMS to not exit, and to continue responding to DirsWatcher events as described above.

Let's start with the file `example/project/documents-overlay/affiliate.html.md`.  This overlays another file, `test/documents-example/affiliate.html.md`.

Making any change to that causes this response:

```
documents change documents affiliate.html.md {
  fspath: '../project/documents-overlay/affiliate.html.md',
  vpath: 'affiliate.html.md',
  mime: 'text/markdown',
  mounted: '../project/documents-overlay',
  mountPoint: '/',
  pathInMounted: 'affiliate.html.md',
  stack: [
    {
      fspath: '../project/documents-overlay/affiliate.html.md',
      vpath: 'affiliate.html.md',
      mime: 'text/markdown',
      mounted: '../project/documents-overlay',
      mountPoint: '/',
      pathInMounted: 'affiliate.html.md'
    },
    {
      fspath: '../../test/documents-example/affiliate.html.md',
      vpath: 'affiliate.html.md',
      mime: 'text/markdown',
      mounted: '../../test/documents-example',
      mountPoint: '/',
      pathInMounted: 'affiliate.html.md'
    }
  ]
}
renderedPath affiliate.html.md ==> affiliate.html
renderMarkdown affiliate.html.md ==> ../project/out/affiliate.html
```

We see a _Change_ event, with the expected _vpinfo_ object, describing the two files in the stack.  Then it computes the _renderedPath_, and finally renders the Markdown.

Changing its name to `example/project/documents-overlay/affiliate-foo.html.md` results in these events:

```
documents change documents affiliate.html.md {
  fspath: '../../test/documents-example/affiliate.html.md',
  vpath: 'affiliate.html.md',
  mime: 'text/markdown',
  mounted: '../../test/documents-example',
  mountPoint: '/',
  pathInMounted: 'affiliate.html.md',
  stack: [
    {
      fspath: '../../test/documents-example/affiliate.html.md',
      vpath: 'affiliate.html.md',
      mime: 'text/markdown',
      mounted: '../../test/documents-example',
      mountPoint: '/',
      pathInMounted: 'affiliate.html.md'
    }
  ]
}
renderedPath affiliate.html.md ==> affiliate.html
renderMarkdown affiliate.html.md ==> ../project/out/affiliate.html
documents add documents affiliate-foo.html.md {
  fspath: '../project/documents-overlay/affiliate-foo.html.md',
  vpath: 'affiliate-foo.html.md',
  mime: 'text/markdown',
  mounted: '../project/documents-overlay',
  mountPoint: '/',
  pathInMounted: 'affiliate-foo.html.md',
  stack: [
    {
      fspath: '../project/documents-overlay/affiliate-foo.html.md',
      vpath: 'affiliate-foo.html.md',
      mime: 'text/markdown',
      mounted: '../project/documents-overlay',
      mountPoint: '/',
      pathInMounted: 'affiliate-foo.html.md'
    }
  ]
}
renderedPath affiliate-foo.html.md ==> affiliate-foo.html
renderMarkdown affiliate-foo.html.md ==> ../project/out/affiliate-foo.html
```

We first get a _Change_ event, followed by an _Add_ event.  The _Change_ event describes the front-most file for `affiliate.html.md` as `test/documents-example/affiliate.html.md`.  In other words, that file is no longer hidden by the file in `documents-overlay`.

The _Add_ event is because the file that had been `documents-overlay/affiliate.html.md` is now named `documents-overlay/affiliate-foo.html.md`.  In other words, DirsWatcher saw that as a newly added files.

To SimpleCMS this looked like `documents-overlay/affiliate.html.md` had been deleted, revealing `test/documents-example/affiliate.html.md`, and then `documents-overlay/affiliate-foo.html.md` was added.

We've demonstrated part of the events described earlier, so what happens if we simply add a new file?

```
documents add documents new-file.md {
  fspath: '../project/documents-overlay/new-file.md',
  vpath: 'new-file.md',
  mime: 'text/markdown',
  mounted: '../project/documents-overlay',
  mountPoint: '/',
  pathInMounted: 'new-file.md',
  stack: [
    {
      fspath: '../project/documents-overlay/new-file.md',
      vpath: 'new-file.md',
      mime: 'text/markdown',
      mounted: '../project/documents-overlay',
      mountPoint: '/',
      pathInMounted: 'new-file.md'
    }
  ]
}
renderedPath new-file.md ==> new-file.html
renderMarkdown new-file.md ==> ../project/out/new-file.html
```

This is a newly created file, and you can inspect the results in the `project/out` directory.  As expected, an _Add_ event was triggered, followed by the `renderMarkdown` call to render the file.

Then, if we simply delete this file:

```
documents unlink documents new-file.md {
  fspath: '../project/documents-overlay/new-file.md',
  vpath: 'new-file.md',
  mime: 'text/markdown',
  mounted: '../project/documents-overlay',
  mountPoint: '/',
  pathInMounted: 'new-file.md'
}
renderedPath new-file.md ==> new-file.html
```

An _Unlink_ event is triggered, and notice how the _vpinfo_ object does not have a `stack` field.  It was unable to find a matching file anywhere in the directory stack, because the file was deleted.  The result of this is to compute the filename of the rendered file, and to call `fs.unlink` to remove the rendered file.  And, indeed, `project/out/new-file.html` will be gone.

# Summary

The DirsWatcher class can easily be the basis for a custom static website generator application.  The SimpleCMS example is not that far from being a useful system.

DirsWatcher is ready to go and appears fairly stable.  It is the result of several years of developing code for AkashaCMS, and it has been tested deeply using AkashaCMS modules.

