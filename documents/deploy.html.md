---
layout: article.html.ejs
title: Deploying AkashaCMS web sites
rightsidebar:
---

The `root_out` directory contains the rendered website.

You can view this locally using the `akashacms serve` command.  But of course the goal is deployment to a public webserver.

One way to do this is

    $ akashacms build
    $ (cd out; scp -r . user@server.domain:example.com )

## Deploying with rsync (experimental) ##

A new experimental feature is deployment with `rsync` to an SSH based account.  This is done with the `akashacms deploy` command, but that command depends on information in the site configuration (`config.js`).

The result will be as if you ran this command

    $ rsync --verbose --archive --delete out/ user@server.domain:example.com/

The trailing slashes ensure that `rsync` copies the directory tree.  This also ensures timestamps are preserved, and that if you delete a file locally it'll be deleted from the server.  For this to run without you being asked for a password, you must have configured an `ssh` key.

In `config.js` give this configuration

    deploy_rsync: {
        user: 'user',
        host: 'server.domain.com',
        dir:  'example.com'
    }

Under the covers `akashacms deploy` looks for this information to construct the `rsync` line given above.

This feature has only been tested on a Mac OS X system, not Windows.  I suspect it will work on any Unix-like system.  However, Windows does not have `rsync` so you may be out of luck.  The [cwRsync](http://www.rsync.net/resources/howto/windows_rsync.html) tool may work but has not been tested.