---
layout: article.html.ejs
title: Deployment using rsync
rightsidebar:
---

The `rsync` command (Unix, Linux, Mac OS X, etc) is very powerful with a huge number of options.  It can be used to deploy a rendered website this way:

    $ rsync --verbose --archive --delete out/ user@server.domain:example.com/

The trailing slashes ensure that `rsync` copies the directory tree.  This also ensures timestamps are preserved, and that if you delete a file locally it'll be deleted from the server.  You must have set up password-less SSH access, such as installing an SSH key, or else you'll be prompted for a password.

You can configure an AkashaCMS website to use `rsync` for deployment with these commands:

    $ akashacms build
    $ akashacms deploy

In `config.js` give this configuration

    deploy_rsync: {
        user: 'user',
        host: 'server.domain.com',
        dir:  'example.com'
    }

Under the covers `akashacms deploy` looks for this information to construct the `rsync` line given above.

This feature has only been tested on a Mac OS X system, not Windows.  I suspect it will work on any Unix-like system.  However, Windows does not have `rsync` so you may be out of luck.  The [cwRsync](http://www.rsync.net/resources/howto/windows_rsync.html) tool may work but has not been tested.