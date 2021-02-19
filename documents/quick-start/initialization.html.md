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

It is easy to store an AkashaCMS project in a Git repository.  On Github we have several repositories containing example starter projects, and this is one.

The typical workflow is what's shown here.  You clone the repository, then run `npm install` to install dependencies.  The `build` script is used to build the project, which renders it into an output directory.  The `preview` command might run a local web browser, so you can view the site in a browser.  Another script, `deploy`, might copy the rendered output directory to a public webserver that's associated with a public domain name.

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

As said earlier, `akasharender` is the rendering engine for AkashaCMS.  There are several plugins available that extend its capabilities for various purposes.  The `base` plugin provides foundational features useful for typical websites.

```
$ npm install @akashacms/plugins-booknav @akashacms/plugins-breadcrumbs \
        @akashacms/plugins-tagged-content --save
$ npm install @akashacms/theme-bootstrap bootstrap popper.js jquery --save
```

The `booknav` plugin generates useful navigational elements, and the `breadcrumbs` plugin generates a breadcrumb trail based on the file hierarchy.  The `tagged-content` plugin implements taxonomical tags for content, as well as index pages for each taxonomy term.

It's possible to use any web framework to aid with page layout and user interface elements.  In the AkashaCMS project we've only created support for the Bootstrap framework.  The `theme-bootstrap` plugin contains template snippets for using Bootstrap features, and the other packages named here are ones required for using Bootstrap.

```
$ npm install live-server --save
```

The `live-server` package is a webserver meant for use during development.  It can watch a directory of website files, and if any file is changed the server will trigger an automatic reload in the browser.  This makes it an excellent tool for previewing content on your laptop during creation.

There is a long list of additional tools, like `html-minifier`, we can install to support a web development workflow.  Feel free to install whatever you like.

In the `package.json` file add this `scripts` section:

```json
"scripts": {
    "prebuild": "akasharender copy-assets config.js",
    "build": "akasharender render config.js",
    "deploy": "cd out && rsync --archive --delete --verbose ./ user-name@server-host.com:path-to-docroot/ ",
    "preview": "live-server out",
}
```

The `build` script has an associated `prebuild` script.  It runs `akasharender copy-assets` to copy files from the `assets` directory to the `out` directory.  Then the `build` script runs `akasharender render` to render all files in `documents` for the `out` directory.

The `deploy` script shows using `rsync` to upload the rendered website to a server.  Obviously one can replace this with other commands such as `aws s3 cp` to upload the files to an AWS S3 bucket.

The `preview` script runs `live-server` to provide a live preview of the site.  With this you could be editing site content, and then every so often run `npm run build` to re-render the site, which will cause `live-server` to automatically reload the browser window.







