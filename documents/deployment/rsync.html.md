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

If you need to tell `rsync` to exclude files from consideration, that is with this sort of command:

    $ rsync --verbose --archive --delete --exclude /path/to/foo.bar out/ user@server.domain:example.com/

Then add a `exclude` tag in the configuration like so:

    deploy_rsync: {
        user: 'user',
        host: 'server.domain.com',
        dir:  'example.com',
        exclude: '/path/to/foo.bar'
    }

The string specified is passed directly to rsync, so all the filter pattern stuff mentioned in the man page applies.

If you need to specify exclusion for multiple patterns, you'll have to use a file to specify the patterns.  Simply create a file containing the exclude patterns, as documented in the rsync man page, and set up the configuration like so:

    deploy_rsync: {
        user: 'user',
        host: 'server.domain.com',
        dir:  'example.com',
        excludeFile: 'exclusions.txt'
    }

This `deploy_rsync` feature has only been tested on a Mac OS X system, not Windows.  I suspect it will work on any Unix-like system, because `rsync` is commonly installed on these systems.  However, Windows does not have `rsync` so you may be out of luck.  The [cwRsync](http://www.rsync.net/resources/howto/windows_rsync.html) tool may work but has not been tested.