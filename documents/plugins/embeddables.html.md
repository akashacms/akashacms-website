---
layout: article.html.ejs
title: Embeddable content plugin (akashacms-embeddables)
rightsidebar:
teaser: Support embedding stuff from 3rd parties on an AkashaCMS site.  For example, easily embed a YouTube video (or data about one) using just the URL of the video.  Data to be embedded is retrieved via API's exposed by the sites.
---

This plugin is a catch-all meant to support any service supporting embeddable content.  Currently there are two services implemented

* Google Docs Viewer - let's you embed any document from around the Internet using just a URL
* Youtube - Responsive implementation of a YouTube player
* Vimeo - same, but for videos on vimeo.com
* Slideshare - embed slide deck presentations from Slideshare
* Viewer.js Viewer - Let's you embed documents supported by Viewer.js/PDF.js

It's of course possible to support more embeddable services.  Please submit a pull request with code for any other service on the [akashacms-embeddables project](https://github.com/robogeek/akashacms-embeddables).

## Google Docs Viewer

A little known service is that Google Docs allows you to generate an embeddable document viewer that can be embedded on any website.  The viewer is given a URL to retrieve, and it can display any file which Google Docs knows how to interpolate.  They support a long list of document formats.

It's a good service, but I've noticed some odd behavior such as usage limits or a refusal to translate non-PDF documents if you're not logged into a Google account.  For my sites I'm converting to Viewer.js, which is shown below.

    <googledocs-viewer href="..." />
    
Generate a document viewer for the document named in the URL.  This URL can reference any website on the public Internet.

This is rendered through the partial named: `google-doc-viewer.html.ejs`

    <googledocs-view-link href="..." >Anchor Text</googledocs-view-link>

Instead of generating an embedded viewer, this generates a link to Google's service.  The viewer will leave your site and go to Google once clicking on the URL.

This is rendered through the partial named: `google-doc-viewer-link.html.ejs`

## Viewer.js

This is a pure JavaScript document viewer that primarily supports PDF, and a few other file formats.  It's built from the PDF.js viewer developed by the Mozilla organization.  The in-line PDF viewer built into Mozilla is PDF.js.  For information about Viewer.js, see http://viewerjs.org/

When your site is built, the `akashacms-embeddables` plugin includes a directory tree `/vendor/Viewer.js` containing the code required to run Viewer.js.

    <docviewer href="..." width="..." height="..."/>

I believe that Viewer.js can only display documents hosted by the site, and not documents hosted elsewhere.  This tag will attempt to instruct Viewer.js to display a remote document.

The `href=` must be the pathname from the root of the document tree.  It cannot be a relative path from the document.  Internally, the code generates a relative URL from the viewer code and you can learn why in the [Viewer.js installation instructions](http://viewerjs.org/instructions/)

    <docviewer-link href="..." >Anchor Text</docviewer-link>

Generates a link so the viewer can use a full-screen document viewer.  This document viewer is still hosted on your site, and above the `href=` must be the full path from the root of the document tree.

## YouTube & Vimeo

For both video services, the code retrieves data using the oEmbed protocol documented by each site.  That gives enough data to display a video viewer and a little bit of metadata.

YouTube supports an additional API that supports additional data.  You request access to that API, YouTube Data API v3, through the Google API Developers Console (https://code.google.com/apis/console/).  Once you have access to the API the API Console will give you an access key.  If you don't use the API key, most of the youtube tags shown below will continue to work but supply less information.  The key must be entered into your `config.js` like so:

    embeddables: {
        youtubeKey: '.....API Key.....'
    },

Since the API key is private between you and Google, you should probably keep this secret somehow.  Don't check it into a Github repository in other words.

    <youtube-video-embed href="..."/>

Generate just a YouTube player given a YouTube URL.

    <youtube-video href=".."/>

Generate a YouTube player surrounded by a little bit of text, a title, author reference, and link.  This is rendered through the partial: `youtube-embed.html.ejs`

    <youtube-thumbnail href=".."/>

Display the Thumbnail given the URL.  This is rendered through the partial: `youtube-thumb.html.ejs`

    <youtube-metadata href=".."/> 

Retrieve video metadata (currently only the thumbnail image) and add it to the `<HEAD>` section of the site as meta tags.

    <youtube-title href=".."/>  
    <youtube-author href=".."/> 
    <youtube-description href=".."/> 
    <youtube-publ-date href=".."/> 

Retrieve some data items about the video.

    <framed-youtube-player href=".."/> 

Like the `youtube-video` tag, generates a YouTube player surrounded by some other information.  This includes more information, including the description pulled from the YouTube site.

It's rendered through the partial: `framed-youtube-player.html.ejs`

    <vimeo-player url="..." />
    <vimeo-thumbnail url="..." />
    <vimeo-title url="..." />
    <vimeo-author url="..." />
    <vimeo-description url="..." />
    <framed-vimeo-player url="..." />

Similar operations but for videos stored on Vimeo.com.

These are rendered through the following partials

* `framed-vimeo-player`: `framed-vimeo-player.html.ejs`
* `vimeo-thumbnail`: `youtube-thumb.html.ejs`  (no, that's not a typo)

```
<video-embed-code href="..."/>
```

Generates some HTML that people can embed on their sites, linking to your site, and showing some info about the video.  It recognizes YouTube and Vimeo URL's and generates the appropriate code for each.

The embed code is rendered through the partial: `video-embed-code.html.ejs`

It's made available to the viewer of the site through the builtin module partial: `ak-show-embed-code.html.ejs`

## Slideshare

	<slideshare-embed href=".."/>

Embeds a slideshare presentation into your site, from the given URL

	<slideshare-metadata href=".."/>

## Twitter

    <twitter-embed href=".."></twitter-embed>

Embeds a tweet. 

## oEmbed

Like `youtube-metadata` it generates `<HEAD>` meta tags with thumbnails for the presentation.

	<oembed href="..." template="..."/>

Embeds anything supported by the oEmbed protocol.  This protocol is supported by many sites allowing you to generate an embedded viewer using just the URL.

