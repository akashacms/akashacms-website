---
layout: index-page.html.ejs
title: Deploying an AkashaCMS web site
rightsidebar:
---

Once a website is rendered, the `root_out` directory contains the rendered website.  Obviously, the goal is deployment to a public webserver.

One way to do this is

    $ akashacms build
    $ (cd out; scp -r . user@server.domain:example.com )

But we have a much easier way

    $ akashacms build
    $ akashacms deploy

There are two methods for deployment, [rsync](rsync.html) and [ssh](ssh2.html).