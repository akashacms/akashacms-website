---
layout: article.html.ejs
title: Installing AkashaCMS
rightsidebar:
author: david
publicationDate: November 11, 2015
---
Theoretically installing AkashaCMS and getting started is this simple:

    $ npm install -g akashacms-cli
    $ akashacms init akashacms-example
    $ cd akashacms-example
    $ npm install
    $ akashacms build
    $ akashacms preview

Then visit [http://localhost:6080](http://localhost:6080).  This works for me on my Mac OS X laptop and I believe will work on other Unix/Linux/etc type of systems.  These steps have been reported to work on Windows machines.

The first command may have to be done this way on most systems:

    $ sudo npm install -g akashacms-cli

The last command can be replaced with the following to launch an in-browser website editor.  The editor is at [http://localhost:8080](http://localhost:8080) while the previewer is at [http://localhost:6080](http://localhost:6080)

    $ akashacms serve

Necessary pre-requisite - installing Node.js
============================================

AkashaCMS is written for the Node.js platform, and therefore requires that you install Node.js first.  If you don't have Node.js installed the `npm` commands above will have failed.

The first stop is the [Node.js download page](https://nodejs.org/en/download/) where you'll see all the download options.  You may prefer to install via a package manager for your system, [which is also documented on nodejs.org](https://nodejs.org/en/download/package-manager/).

A quick test is to run these commands

    $ node --help
    $ npm help

AkashaCMS has been tested for Node.js v0.10.0 and above.

Some Node.js modules (in the npm repository) are written with C++ code and must be compiled when installed.  This means you must have C/C++ compiler tools installed.  The page discussing installation through package managers covers compiler tools installation for many systems, but not for Mac OS X or Windows.

Since the actual dependency on compilers is `node-gyp` it is the [node-gyp project home page](https://github.com/nodejs/node-gyp) which documents installation of compiler tools for various systems, including Mac OS X and Windows.  Hint:  For OS X install Xcode, for Windows install the free Microsoft Visual Studio release.

AkashaCMS example and skeleton websites
=======================================

We have created two sample websites for AkashaCMS.  The `akashacms-example` site shown above contains a few examples of using AkashaCMS plugins.  We also use it for testing AkashaCMS features.  But it isn't a good starting point.

The `akashacms-skeleton` is a completely stripped down website, that's meant to be a starting point.  Install it this way:

    $ akashacms skeleton akashacms-skeleton

The repositories for these examples are at:

* [https://github.com/akashacms/akashacms-website](https://github.com/akashacms/akashacms-website): The source for this very website, serving as an example of building a comprehensive website.
* [https://github.com/akashacms/akashacms-example](https://github.com/akashacms/akashacms-example): The workspace installed with the `akashacms init` command.
* [https://github.com/akashacms/akashacms-skeleton](https://github.com/akashacms/akashacms-skeleton): The workspace installed with the `akashacms skeleton` command.
* [https://github.com/akashacms/akashacms-blog-skeleton](https://github.com/akashacms/akashacms-blog-skeleton): Showing how to set up a blog using the `akashacms-blog-podcast` plugin.

Other AkashaCMS installation options, such as Windows
=====================================================

On Windows there are a couple pre-requisite steps.  First we must set up a couple dependencies (Node.js and git).  I have tested this method on Windows XP and found it to work.

* Install Node.js using the installer from nodejs.org
* Install [msysgit](http://msysgit.github.com/).  Go to the Downloads page and get the file at the top.  Once downloaded run the `.exe` file you just downloaded and go through the installer.  Select the option that allow `git` to be run from Windows batch files.
* As noted above, install Visual Studio C++

Next is the question of installing `akashacms-cli` as a global package.  I don't currently have access to Windows, but a couple years ago had tried installing AkashaCMS on Windows and had troubles installing it as a global package.  Also, many are currently saying global package installs are a bad idea and it's better to install it locally.

The first step is to select a directory on your disk where you'll be working on websites.  For Windows, I tested this in `C:\Documents and Settings\David Herron` but of course you could do this anywhere.  On my Linux system I'm using `$HOME/ws` for all websites.

At the command line, navigate to your chosen directory

    C:\..> npm install akashacms-cli

Or

    $ npm install akashacms-cli

After this step `npm` will have created a directory named `node_modules` containing two directories, one named `.bin` and the other named `akashacms`.  Inside the `node_modules/.bin` is an executable file named `akashacms`.

Now you can execute:

    $ ./node_modules/.bin/akashacms init akashacms-example
    $ cd akashacms-example
    $ npm install
    $ ../node_modules/.bin/akashacms build
    $ ../node_modules/.bin/akashacms preview

For Windows, you may have to reverse the slashes ...because... Windows.

The first thing you'll want to do is simplify this.  That's as simple as adding the `node_modules/.bin` directory to your PATH variable.

On Windows, start the `Control Panel` and open the System Properties panel.  Click on Advanced and then click on the button marked Environment Variables at the bottom of the window.  In the top is a section of "User variables" one of which is PATH.  Select the line marked PATH, click the Edit button, then add the pathname for the `.bin` directory.  On my computer the PATH variable became `C:\Documents and Settings\David Herron\node_modules\.bin`.

For Linux/Unix it's as simple as updating your `.profile` or `.bashrc` or `.login` or `.cshrc` (depending on your login shell) with the equivalent of

    export PATH=$HOME/path/node_modules/.bin:${PATH}

At this point you'll have to close the command window, and start a new one, so that it picks up the new PATH variable.

On Windows a variant of this command will work, and let you avoid closing the window.  This command can be saved in a `.cmd` file if you like:

    set PATH=%PATH%;C:\Documents and Settings\David Herron\node_modules\.bin

Then you can execute `akashacms` as a regular command

    C:\..> akashacms init akashacms-example
    C:\..> cd akashacms-example
    C:\..> akashacms build
    C:\..> akashacms preview

Then visit [http://localhost:6080](http://localhost:6080).  This worked for me in a Windows XP image running in Virtual Box.

Taking a tour of akashacms-example
==================================

The above commands let you verify you have a working AkashaCMS installation.  Let's take a brief tour.

First is the `config.js` file, which is documented in <!-- [Configuring AkashaCMS](/configuration/index.html). --> This is a little Node module that simply returns a data object describing the configuration of a website.  It lists several directories, has a place for you to put data and functions specific to your website.

The content files ([Writing content in AkashaCMS](/akasharender/3-create-content.html)) are located in the `documents` directory which in turn is named in the `root_docs` configuration variable.  The format of these files is straight-forward, some metadata at the front (frontmatter) and content following the frontmatter.

The other directories are `assets`, containing unprocessed static files like images and CSS, `layouts`, containing page layouts <!-- ([Page layout in AkashaCMS](/layout/index.html)), and `partials` containing a couple mini-templates ([Partials in AkashaCMS](/layout/partials.html)). -->
