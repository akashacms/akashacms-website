---
layout: getting-started.html.njk
title: AkashaRender Projects, and using package.json to describe the build process
rightsidebar:
author: david
publicationDate: December 23, 2021
---

We've just discussed the AkashaRender Configuration object, and how to generate it in a Configuration file:  [](/quick-start/configuration.html).  This means that an AkashaRender project is comprised of these parts:

* A _Configuration_ object, that's usually in a Node.js module we call the config file
* A directory containing a `package.json`, which is a Node.js artifact to describe a Node.js project directory
* Multiple directories containing files for assets, documents, layouts and partials

In this section we'll focus on using the `package.json` in an AkashaRender project.

# The `package.json` file

The `package.json` file is used by the Node.js platform to describe any package.  Because AkashaRender is written in Node.js, that makes the `package.json` a very natural tool for describing part of an AkashaCMS project.  The `package.json` offers these useful features:

* A project name, author name, repository URL, etc.
* The `scripts` section can be used to automate processes like building and deploying the project
* The `dependencies` section can be used to bring in AkashaCMS plugins and other useful packages

While `package.json` was designed for use by Node.js and npm projects, its features are useful for for AkashaCMS projects.  Oh, and is there a distinction between the phrase AkashaRender project and AkashaCMS project?  Nope.  They're the same thing.

# Declaring AkashaCMS project dependencies in `package.json`

It is good form for any software project to have clearly listed any dependencies.  This is so anyone can quickly and reliably setup the project with very simple instructions.

The `dependencies` section of `package.json` was primarily designed for Node.js dependencies.  Primarily this meant downloading packages stored in the npm repository.  But, it was designed with quite a lot of flexibility to download assets from a wide variety of locations.

Ideally, project setup is this simple:

```
$ git clone GIT-URL-FOR-PROJECT
$ cd PROJECT-DIRECTORY
$ npm install
```

In other words, we must strive for all dependencies to be declared in the `dependencies` section, and installed using `npm install`.

For AksashaCMS the sort of dependencies we might use are:

* AkashaCMS plugins
* Extra libraries like CSS/JavaScript frameworks, or icon libraries
* Additional processing tools like `postcss`, or `minify`
* Build process management tools like `npm-run-all`

# AkashaCMS plugins

We've designated the `@akashacms` namespace in the npm repository for holding AkashaCMS plugins.  This wasn't always the case and a few might still use old package names.  The [plugin index](/plugins/index.html) contains documentation, including the package names.

```json
"dependencies": {
    ...
    "@akashacms/plugins-authors": "github:akashacms/akashacms-plugin-authors",
    "@akashacms/plugins-base": "akashacms/akashacms-base#watcher",
    "@akashacms/plugins-blog-podcast": "akashacms/akashacms-blog-podcast#watcher",
    ...
}
```

Normally we'd put a version number here in the dependency to grab the package from the npm repository.  However, we can also use Github references like these.  Often new feature development in plugins are not pushed to the npm repository until the feature is finished, which means we might use the in-development version.

Additionally, you might develop your own plugins and desire to load them using a Github reference, like these.

# Front end CSS/JavaScript frameworks like Bootstrap

In the AkashaCMS plugins, we've leaned towards assuming Bootstrap would be used to assist with page layout and useful constructs.  The Bootstrap framework is distributed through the npm repository, even though it contains no Node.js code.  The same holds true for jQuery and Popper, both of which are required by Bootstrap v4.

```json
"dependencies": {
    ...
    "bootstrap": "^4.6.x",
    "jquery": "^3.5.x",
    "popper.js": "^1.16.x"
}
```

These are the correct dependencies for using Bootstrap v4.  For better or for worse, the Bootstrap support in AkashaCMS is currently at version 4.

There are plenty of other front end frameworks.  AkashaCMS does not force you to use Bootstrap, but the path which requires the least amount of work is to use Bootstrap.

This means the files land in `node_modules`.  In the config file you can use these declarations:

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
    })
```

This ensures the files for each framework appear in the output directory under the `/vendor` path.

Then, to ensure these are used in rendered HTML files:

```js
config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/popper.js/umd/popper.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
```

This ensures the correct HTML tags will be generated.

Similarly, there are many icon libraries available through the npm repository.

```json
"dependencies": {
    ...
    "@fortawesome/fontawesome-free": "^5.7.2",
    "bootstrap-icons": "^1.7.x",
    ...
}
```

With both, the package is installed into `node_modules`.  We can add that directory using `addAssetDir`, then add either JavaScript or Stylesheets as shown above.

# Defining a build procedure for AkashaCMS project in `package.json`

It may not seem like much, but the `scripts` section of `package.json` can be used to build comprehensive procedures.  While it's best used for simple procedures, we can go to town and build something complex.

For a comprehensive discussion see: [How to use npm/yarn/Node.js package.json scripts as your build tool](https://techsparx.com/nodejs/tools/npm-build-scripts.html)

The following tools will tame the complexity somewhat.

```json
"dependencies": {
    ...
    "npm-run-all": "^4.1.x",
    "@compodoc/live-server": "^1.2.x",
}
```

Out of the box, npm lets us do a little bit of process flow.  Namely, if we have a `build` script, then the `prebuild` runs before `build`, and `postbuild` runs after `build`.  While this is useful, we often want something more powerful.  That's what `npm-run-all` offers.

Another thing we want is to edit site content, and have a live preview in a web browser.  Editing Markdown or AsciiDoc files is nice and easy, but we don't see the final result until the site is rendered.  The nicest workflow is to have the file automatically rendered every time we save the file, so we can quickly view the result in a real browser.

Both of those needs are handled as so:

```json
"scripts": {
    "build": "npm-run-all build:copy build:render",
    "build:copy": "akasharender copy-assets config.js",
    "build:render": "akasharender render config.js",
    "watch": "npm-run-all --parallel watcher preview",
    "watcher": "akasharender watch config.js",
    "preview": "live-server out",
}
```

The `build` script shows `npm-run-all` being used for sequential execution.  It first executes the script in the `build:copy` tag, and second the script in the `build:render` tag.  We could have instead put `build:*` to simply execute all scripts with the `build` prefix.  But, by explicitly listing the tags we are positively in control over the order of execution.

Running `copy-assets` copies files from the assets directories to the output directory.  Running `render` renders files in the documents directories to the output directory.

The `watch` script shows `npm-run-all` being used for parallel execution.

The `akasharender watch` command automatically scans the directories, and on any change it rebuilds any files that have changed.  This is one half of implementing a live preview mode, namely it automates rebuilding files when changed.

The `live-server` command is a simple webserver which causes the browser to automatically reload the page whenever a file changes.  Notice we're using the `@compodoc/live-server` package rather than the `live-server` package.  The latter has not been updated for awhile, and there are known vulnerabilities in its dependencies, which the `@compodoc` version has fixed.  In any case `live-server` implements the second half of live preview mode, namely to automate refreshing the browser when the files have been rebuilt.


