---
layout: blog.html.njk
title: Progress on jQuery-style templates for AkashaCMS (Mahabhuta)
publicationDate: 2014-06-01 16:43
blogtag: news
teaser: |
    Since last weekend I've been working on Mahabhuta, the new element-oriented template system using jQuery's API, in AkashaCMS.  The goal was to verify that it's useful by attempting to implement some important things with it.  I'm happy to say that Mahabhuta is living up to what I hoped.  I've been able to reduce complexity in AkashaCMS and the path is clear to perhaps removing the Kernel template engine, because the functionality I sought with Kernel is now available via Mahabhuta.
---

See earlier announcement:  [](mahabhuta-announce.html)

The week's work resulted in two things:  
* a base page template implemented entirely with Mahabhuta,
* custom tags for embedding YouTube videos or document viewing using either Google Docs or ViewerJS

The old base page template was implemented using EJS, and while that was okay it did mix markup with code causing a bit of confusion.  The Mahabhuta version is wholly markup, albeit with a bunch of custom tags:

```
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
<meta charset="utf-8" />
<!-- Use the .htaccess and remove these lines to avoid edge case issues. More info: h5bp.com/i/378 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<ak-page-title/>
<ak-header-metatags/>
<ak-sitemapxml/>
<ak-siteverification/>
<ak-stylesheets/>
<ak-headerJavaScript/>
</head>
<body>
<ak-insert-body-content/>
<!-- JavaScript at the bottom for fast page loading -->
<ak-footerJavaScript/>
<ak-google-analytics/>
</body>
</html>
```

Interpolating one of these tags is pretty straight-forward:

```
      if (typeof config.googleSiteVerification !== "undefined")
          $('ak-siteverification').replaceWith(
                akasha.partialSync(config, "ak_siteverification.html.ejs",
                        { googleSiteVerification: config.googleSiteVerification })
          );
     else
          $('ak-siteverification').remove();
```

This will be instantly familiar to any jQuery programmer - look for the custom tag, and `replaceWith` using some HTML.  The HTML in this case is rendered through an EJS template, and in this case represents the Google Site Verification code.  If no code is available, the custom tag is instead removed.

The other new feature is to rewrite the `akashacms-embeddables` module to use Mahabhuta tags.  That module is meant to support tools that embed content onto a page - such as YouTube videos, or using the Google Docs viewer (and more recently ViewerJS) to present documents directly on the page.

Until now the Embeddables module required the content be written in either EJS or Kernel template syntax, to access the code in the Embeddables module.  Because the Markdown engine doesn't support scripting tags, you couldn't use Embeddables with Markdown.  But now there are two ways to do so.

First, your document file can me named `xyzzy.html.md.ejs` and you can then use the older tags to access the Embeddables module.  But now you can do this using a custom tag.

Simply name the document file "xyzzy.html.md" and then in your Markdown text write something like this:

```
Common use cases for Docker include:

* Automating the packaging and deployment of applications
* Creation of lightweight, private PAAS environments
* Automated testing and continuous integration/deployment
* Deploying and scaling web apps, databases and backend services

<youtube-video href="https://www.youtube.com/watch?v=Q5POuMHxW-0"/>
```


(By the way, Docker looks really cool) The <a href="http://webmaster-tips.davidherron.com/development-tools/docker/2014-04-docker-101.html">resulting page</a> has a UL with those bullet items, and a video that responsively resizes itself to the screen size.  The responsive behavior is provided for free behind that tag.  I'm hoping to implement attributes that might turn on auto-play, or provide a thumbnail and viewing the video in a lightbox style viewer.

I like how clean this feels.  In the past, embedding a video required this syntax and using the Kernel template engine:

```
{youtubePlayer({ youtubeUrl: "http://www.youtube.com/watch?v=8_XgHU-F5wE" })}
```

Similar changes were made to the syntax of using the Google Docs Viewer, or ViewerJS.  Both are now invoked using a custom tag, and Mahabhuta code behind the scenes.

Behind the scenes, the implementation of the custom tag took some careful thought because retrieving information via oEmbed is an asynchronous task.  To keep sync with Mahabhuta we needed to ensure control returns to Mahabhuta only after all the tags are processed.  Hence:

```
config.mahabhuta.push(function(config, $, metadata, done) {
    // <youtube-video href=".."/>  TBD: autoplay, thumbnail+lightbox
    var elemsYT = [];
    $('youtube-video').each(function(i, elem) { elemsYT[i] = elem; });
    // util.log(util.inspect(elemsYT));
    async.forEachSeries(elemsYT, function(elemYT, cb) {
        // util.log(util.inspect(elemYT));
        akasha.oembedRender({
            template: "youtube-embed.html.ejs",
            url: $(elemYT).attr("href")
        }, function(err, html) {
            if (err) cb(err);
            else {
                $(elemYT).replaceWith(html);
                cb();
            }
        });
    }, function(err) {
        done(err);
    });
});
```

We're first using jQuery's `.each` function to retrieve data on all `youtube-video` tags, and second using async's `forEachSeries` function to process each in turn.  Why not just do it all in the `.each` function?  That's because we must call `done` when all the asynchronous processing is finished, and this arrangement ensures we can do so.
