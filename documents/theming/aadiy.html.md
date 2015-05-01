---
layout: article.html.ejs
title: DIY Theming of an AkashaCMS website
rightsidebar:
---

The [AkashaCMS-base plugin](/plugins/base.html) provides a couple useful tools that you may, or may not, want to use in theming your website.  Let's go over how to use them.

Most important is that it provides a base layout, [`ak_page.html.ejs`](https://github.com/robogeek/akashacms-base/blob/master/layout/ak_page.html.ejs), that is derived from the Boilerplate framework, and provides complete ability to specify stylesheets and JavaScript at both the top and bottom.

You use this base layout page by declaring this in the layouts for your site:

    ---
    ...
    layout: ak_page.html.ejs
    ...
    ---

To configure the stylesheets and JavaScript add this data to your `config.js`

    data: {
        ...
        headerScripts: {
            stylesheets: [
                { href: "/video.css", media: "screen" },
                { href: "/style.css", media: "screen" },
                ... other stylesheets
            ],
            javaScriptTop: [
                
            ],
            javaScriptBottom: [
                
            ]
        }
    }

This data is used by the [`ak_stylesheets.html.ejs`](https://github.com/robogeek/akashacms-base/blob/master/partials/ak_stylesheets.html.ejs) and [`ak_javaScript.html.ejs`](https://github.com/robogeek/akashacms-base/blob/master/partials/ak_javaScript.html.ejs) partials.  The first generates the LINK tags necessary for stylesheets, while the second generates the SCRIPT tags necessary for JavaScript.

For example if you wanted to use jQuery (from [Google's Hosted Libraries service](https://developers.google.com/speed/libraries/devguide)), you need to first pull in the jQuery library, and then any plugins desired for your site.  It's recommended that this code load at the bottom of the page to improve the overall goodness of the world.

            javaScriptBottom: [
                { href: "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js" },
                { href: "... URL for your customizations" },
                { script: "... inline JavaScript code" }
            ]

Just by changing `javaScriptBottom` to `javaScriptTop` this code will move to the top of the page.