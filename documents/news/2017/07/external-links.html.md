---
layout: blog.html.ejs
title: Published AkashaCMS-External-Links, adding "rel=nofollow" and icons to outbound links
publicationDate: July 3, 2017
blogtag: news
teaser: |
    <p>It's now required that outbound links to sites that pay money (e.g. affiliate marketing) be marked with <em>rel=nofollow</em>.  Your visitors might feel comforted being informed that a link leads to an external site, and perhaps to know what site that is. </p>
---

The new `akashacms-external-links` handles both those cases and more.

At the moment its features are:

* Add `target=_blank` to outbound links
* Add the destination site _favicon_ to outbound links
* Add a simple icon next to outbound links (this and the favicon support are mutually exclusive)
* Control which sites get `rel=nofollow` based on domain name

See documentation:  [](/akasharender/external-links/index.html)
