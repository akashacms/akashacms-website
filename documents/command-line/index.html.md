---
title: The AkashaCMS command line tool
layout: index-page.html.ejs
---

Installing AkashaCMS also brings along a command-line tool.  The [installation instructions](../install.html) says to do this:

    $ npm install -g akashacms

In addition to installing the AkashaCMS module, the `akashacms` command becomes available.  Let's look at what you can do with this tool.

# Initializing a new AkashaCMS website

Type this:

    $ akashacms init dirName

What this does effectively is this:

    $ git clone git://github.com/robogeek/akashacms-example.git dirName

Which means, it clones the workspace corresponding to the http://example.akashacms.com website.  This can give you a decent starting point for developing a new site.

It does mean your computer must have the `git` software installed.

# Building an AkashaCMS website

While at the top directory of an AkashaCMS workspace, type this:

    $ akashacms build

What this does is read the `config.js` then render the website described by the configuration.

# Rendering an individual file

Suppose you want to render just one file, rather than rebuild the whole site.  It can save a lot of time on a large site to render just one file while testing the rendering of that file.  Type this:

    $ akashacms render path/to/fileName

The `path/to/fileName` must be a filename path within the `root_docs` directory.  The file is rendered, and written into the `root_out` directory.

# Deploying a built website

After rendering a website you want to copy it over to your server:

    $ akashacms deploy

This requires some [configuration in `config.js` as noted elsewhere](/deployment/index.html).

# Running a local webserver to preview the site

After rendering a website you might want to preview it before deploying the site to a server.

    $ akashacms preview

This starts up a webserver on http://localhost:6080

# Notifying search engines the site was updated

The search engine Sitemap protocol includes provision for pinging search engines.

    $ akashacms ping

This sends notifications to the known search engines that are known to support pinging.

# Printing out the configuration

Unsure if you have set up the configuration correctly?  Want to see how the plugins you've installed have affected the configuration?

    $ akashacms config

This prints out the data from the configuration.