---
layout: getting-started.html.njk
title: Initializing an AkashaCMS project
rightsidebar:
author: david
publicationDate: February 18, 2021
---

Before talking about initializing an AkashaCMS project from scratch, let's study one of the sample projects.

```
$ git clone https://github.com/akashacms/akashacms-skeleton.git skeleton
$ cd skeleton
$ npm install
$ .... start hacking
$ npm run build
$ npm run preview
```

It is easy to store an AkashaCMS project in a Git repository.  On Github we have several repositories containing example starter projects, such as:

* `https://github.com/akashacms/akashacms-example`
* `https://github.com/akashacms/akashacms-blog-skeleton`
* `https://github.com/akashacms/akashacms-skeleton`
* `https://github.com/akashacms/open-source-site`

The typical workflow is what's shown above.  You clone the repository, then run `npm install` to install dependencies.  The `build` script is used to build the project, which renders it into an output directory.  The `preview` command runs a local web server, so you can view the site in a browser.  Another script, `deploy`, would copy the rendered output directory to a public web-server that's associated with a public domain name.

The project directory will look like this:

```
$ ls -l
total 24
-rw-r--r--    1 david  admin    347 Mar 25  2017 README.md
drwxr-xr-x    5 david  admin    160 Jun 25  2017 assets
-rw-r--r--    1 david  admin   2137 Feb 17 21:56 config.js
drwxr-xr-x    3 david  admin     96 Mar 25  2017 documents
drwxr-xr-x    3 david  admin     96 Jun 25  2017 layouts
drwxr-xr-x  319 david  admin  10208 Feb 17 21:54 node_modules
drwxr-xr-x   10 david  admin    320 Feb 17 21:56 out
-rw-r--r--    1 david  admin   1221 Feb 17 21:51 package.json
drwxr-xr-x    4 david  admin    128 Jun 25  2017 partials
```

What we have are:

* `config.js` is the JavaScript file which initializes the AkashaCMS Configuration object.
* `package.json` is a normal Node.js project file, where we're primarily interested in listing dependencies on Node.js modules used by the project, and scripts recording how the project is built and deployed
* `assets` is a directory structure containing project assets
* `documents` is a directory structure containing the content for the project
* `layouts` contains page layout templates used in the project
* `partials` contains template snippets used in the project
* `out` is the output directory

This is fairly straight-forward.  While the `akashacms-skeleton` repository is meant to serve as a blank slate, it's useful to know how to initialize a project from scratch.

# Initializing an AkashaCMS project from scratch

Start by creating a directory, and initializing a `package.json`

```
$ mkdir test
$ cd test
$ npm init
```

This creates a nearly-empty `package.json` that can be used in any Node.js project.  What we must do is initialize it for AkashaCMS.

Next, create some directories:

```
$ mkdir assets documents partials layouts
```

As shown above, we'll add various files to these directories.

Next, let's start installing tools:

```
$ npm install akasharender @akashacms/plugins-base --save
```

As said earlier, `akasharender` is the rendering engine for AkashaCMS.  There are several plugins available that extend its capabilities for various purposes.  The `base` plugin provides foundational features useful for typical websites.  If your project is instead an EPUB eBook, do not install the `base` plugin.

```
$ npm install @akashacms/plugins-booknav @akashacms/plugins-breadcrumbs \
        @akashacms/plugins-tagged-content --save
$ npm install @akashacms/theme-bootstrap bootstrap@4.6.x popper.js@1.16.x jquery@3.6.x --save
```

The `booknav` plugin generates useful navigational elements, and the `breadcrumbs` plugin generates a breadcrumb trail based on the file hierarchy.  The `tagged-content` plugin implements taxonomical tags for content, as well as index pages for each taxonomy term.

It's possible to use any web framework to aid with page layout and user interface elements.  In the AkashaCMS project we've only created support for the Bootstrap framework.  The `theme-bootstrap` plugin contains template snippets for using Bootstrap features, and the other packages named here are ones required for using Bootstrap.

When we install `popper.js` there will be a message printed about this version being deprecated, and we should use Popper v2 instead.  However, the Bootstrap v4 documentation explicitly says to use Popper v1.16.1, so that's what we're doing.

```
$ npm install @compodoc/live-server --save
```

The `@compodoc/live-server` package is a webserver meant for use during development.  It can watch a directory of website files, and if any file is changed the server will trigger an automatic reload in the browser.  This makes it an excellent tool for previewing content on your laptop during creation.

```
$ npm install npm-run-all --save
```

The `npm-run-all` package makes it easier to describe complex build procedures in the `scripts` section of a `package.json`.  To learn more, see [How to use npm/yarn/Node.js package.json scripts as your build tool](https://techsparx.com/nodejs/tools/npm-build-scripts.html)

There is a long list of additional tools, like `html-minifier`, we can install to support a web development workflow.  Feel free to install whatever you like.

In the `package.json` file add this `scripts` section:

```json
"scripts": {
    "build": "npm-run-all build:copy build:render",
    "build:copy": "akasharender copy-assets config.js",
    "build:render": "akasharender render config.js",
    "watch": "npm-run-all --parallel watcher preview",
    "watcher": "akasharender watch config.js",
    "preview": "live-server out",
    "deploy": "cd out && rsync --archive --delete --verbose ./ user-name@server-host.com:path-to-docroot/ "
}
```

The `build` script runs the `build:copy` and `build:render` scripts.  The first runs `akasharender copy-assets` to copy files from the `assets` directory to the `out` directory.  The second runs `akasharender render` to render all files in `documents` for the `out` directory.

The `deploy` script shows using `rsync` to upload the rendered website to a server.  Obviously one can replace this with other commands such as `aws s3 cp` to upload the files to an AWS S3 bucket.

The `watch` script runs `live-server` in parallel with `akasharender watch`.  The latter watches the project directory for changes.  On any change, it rebuilds the relevant files, which will then cause files in the `out` directory to change.  The `live-server` tool is told to watch the `out` directory, and its first purpose is to be a web-server.  Its second purpose is, when it detects that a file in the `out` directory has changed, it tells the browser to reload the page.

These two work together, with `akasharender watch` rebuilding any changed files, and `live-server` doing a live reload in the web browser.  The result is very nice, since you can be editing a file, save the edit buffer, and automatically the page rebuilds, and is automatically reloaded in the browser.  It's the closest you'll get to WYSIWYG when editing Markdown files.
