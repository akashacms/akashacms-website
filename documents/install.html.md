---
layout: article.html.ejs
title: Installing AkashaCMS
rightsidebar:
author: david
publicationDate: Jan 1, 2015
---
Theoretically installing AkashaCMS and getting started is this simple:

    $ npm install -g akashacms-cli
    $ akashacms init akashacms-example
    $ cd akashacms-example
    $ akashacms build
    $ akashacms preview

Then visit [http://localhost:6080](http://localhost:6080).  This works for me on my Mac OS X laptop and I believe will work on other Unix/Linux/etc type of systems.

The first command may have to be done this way on most systems:

    $ sudo npm install -g akashacms-cli

The last command can be replaced with the following to launch an in-browser website editor.  The editor is at [http://localhost:8080](http://localhost:8080)

    $ akashacms serve

Installing AkashaCMS on Windows
===============================

For Windows the steps are a little different.  First we must set up a couple dependencies (Node.js and git).  I have tested this method on Windows XP and found it to work.

* Install Node.js using the installer from nodejs.org
* Install [msysgit](http://msysgit.github.com/).  Go to the Downloads page and get the file at the top.  Once downloaded run the `.exe` file you just downloaded and go through the installer.  Select the option that allow `git` to be run from Windows batch files.

Next install AkashaCMS using a slightly different process.  The primary change is to not install AkashaCMS globally, but locally.

The first step is to select a directory on your disk where you'll be working.  I tested this in `C:\Documents and Settings\David Herron` but of course you could do this anywhere.

    C:\..> npm install akashacms

It's very important to leave off the `-g` option.

After this step `npm` will have created a directory named `node_modules` containing two directories, one named `.bin` and the other named `akashacms`.

Before you can do the rest of this you must modify the Windows PATH variable to list the `.bin` directory.  To do so, start the `Control Panel` and open the System Properties panel.  Click on Advanced and then click on the button marked Environment Variables at the bottom of the window.  In the top is a section of "User variables" one of which is PATH.  Select the line marked PATH, click the Edit button, then add the pathname for the `.bin` file.

On my computer the PATH variable became `C:\Documents and Settings\David Herron\node_modules\.bin`.

At this point you'll have to kill the Windows command window, and start a new one, so that it picks up the new PATH variable.

    C:\..> akashacms init akashacms-example
    C:\..> cd akashacms-example
    C:\..> akashacms build
    C:\..> akashacms preview

Then visit [http://localhost:6080](http://localhost:6080).  This worked for me in a Windows XP image running in Virtual Box.

Taking a tour of akashacms-example
==================================

The above commands let you verify you have a working AkashaCMS installation.  Let's take a brief tour.   

First is the `config.js` file, which is documented in [Configuring AkashaCMS](config.html).  This is a little Node module that simply returns a data object describing the configuration of a website.  It lists several directories, has a place for you to put data and functions specific to your website.

The content files ([Writing content in AkashaCMS](content.html)) are located in the `documents` directory which in turn is named in the `root_docs` configuration variable.  The format of these files is straight-forward, some metadata at the front (frontmatter) and content following the frontmatter.

The other directories are `assets`, containing unprocessed static files like images and CSS, `layouts`, containing page layouts ([Page layout in AkashaCMS](layouts.html)), and `partials` containing a couple mini-templates ([Partials in AkashaCMS](partials.html)).