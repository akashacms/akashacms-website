---
layout: blog.html.njk
title: AkashaCMS-Embeddables overhaul, huge simplification
publicationDate: June 28, 2017
blogtag: news
teaser: |
    <p>The <em>akashacms-embeddables</em> plugin has long been a sore thumb, being overly complicated in part because of the wide variety of methods for embedding content from other sites.  It may seem utterly simple when you paste a URL into a Facebook or Twitter status message, or a Wordpress blog post, and voila the embedded HTML snippet automatically pops up.  Under the covers certain kinds of magic is done with oEmbed and OpenGraph protocols.  A couple years ago when I started the <em>akashacms-embeddables</em> plugin that stuff either was immature, or I didn't understand it, or didn't know about it, or something, but the initial versions of the plugin didn't take advantage of those protocols, and instead had lots of special casing and hard-coded understanding of how to construct a Twitter <em>iframe</em>.</p>

    <p>Now that the new AkashaRender-based system is published, I wanted to take the opportunity to clean up the <em>akashacms-embeddables</em> plugin.  I've found a pair of packages that make retrieving oEmbed and OpenGraph data very nice and easy.</p>
---

The overhaul of _akashacms-embeddables_ landed in version 0.6.2

After a fair amount of study of packages in npm related to oEmbed and OpenGraph, I have these observations:

* The _oembetter_ package seems to be the best of those that perform oEmbed lookups.
* The _url-embed_ and _Metaphor_ packages claim to search out all kinds of extra information and jump high hurdles for you.  I'm not impressed.  With a `slideshare.net` URL, _url-embed_ failed to get useful information.  With the _Metaphor_ package, the data object is interesting but in the end not useful.
* The _meta-extractor_ package does a great job of extracting metadata from OpenGraph and Twitter Cards metadata.

But, you're asking, what does this mean for using the _akashacms-embeddables_ plugin?  Glad you asked.

The embedding functionality has been boiled down to one custom tag:

```
<embed-resource href="https://twitter.com/AkashaCMS/status/565602061681971200"/>
```

Which renders as so:

<embed-resource href="https://twitter.com/AkashaCMS/status/565602061681971200"/>

This custom tag works for any URL for which oEmbed and/or OpenGraph returns data.  The algorithm consults oEmbed, OpenGraph and Twitter Cards for metadata.  Between those three sources lots of data is available.

The old _akashacms-embeddables_ had a couple dozen custom tags each embedding specific things.  As they say, one should strive to make things as simple as possible, and no simpler than that.  How do we handle those dozens of use-cases with one custom tag?

1. The custom tag produces a regularized set of data
1. The custom tag takes a `template=` attribute letting you customize what the custom tag does

That last bit is key.  Have a specific need?  Use a different template.

With no `template=` attribute the `embed-resource` does what had been implemented in the `simple-embed` custom tag, which is to simply output the HTML embed code retrieved by oEmbed.  The `twitter-embed` and `slideshare-embed` tags had simply done that, for example, raising the question of why we had separate custom tags for those two sources.  Why not present one API in the `embed-resource` tag?

With the `embed-resource-framed.html.ejs` template, `embed-resource` performs what had been the `framed-embed` tag.  This template displays extra information such as the _description_ or _title_.  Another template, `embed-thumbnail.html.ejs`, replaces the `embed-thumbnail` and `youtube-thumbnail` and `vimeo-thumbnail` tags, and simply displays the image announced via oEmbed/OpenGraph data.

You're of course free to implement your desired template.  What you need to know is the data that's provided.

Rather than replicate the documentation here, see: [](/plugins/embeddables/index.html)
