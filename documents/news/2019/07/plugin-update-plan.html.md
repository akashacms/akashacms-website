---
layout: blog.html.njk
title: With 0.7, the AkashaCMS plugins need to be updated to reflect new API's
publicationDate: July 17, 2019
blogtag: news
teaser: |
    For the AkashaRender/Mahabhuta 0.7 release we added a critical API change making it easier to configure Plugin's and MahabhutaArray's.  While some of the Plugin's have been updated, not all have.
---

The 0.7 release number will indicate whether a given Plugin has been upgraded to the new API.

For the 0.7 release `akashacms-builtin`, `akashacms-base`, and `akashacms-external-links` will fully support the new API.  The others will come along shortly afterward.

Another change to implement is to remove as many overloaded objects from the `metadata` object as possible.  The `metadata` object became burdened with inappropriately added objects like `metadata.config`.  With the new `options` object it is possible to pass these other objects through the options rather than to overload `metadata`.

Status:

Plugin           | Version | Status
-----------------|---------|---------
`akashacms-builtin` | --- | Full support
`akashacms-base` |   0.7.0 | Full support
`akashacms-adblock-checker` |  --- | Full support
`akashacms-affiliates` | 0.7.0 | Full support
`akashacms-blog-podcast` | 0.7.0 | Full support
`akashacms-booknav` | 0.7.0 | Full support
`akashacms-breadcrumbs` | 0.7.0 | Full support
`akashacms-dlassets` |  0.7.0 | Full support
`akashacms-document-viewers` | 0.7.0 | Full support
`akashacms-embeddables` | 0.7.0 | Full support
`akashacms-external-links` | 0.6.0 | Full support TODO release this to npm
`akashacms-footnotes` | 0.7.0 | Full support
`akashacms-tagged-content` | 0.7.0 | Full support
`akashacms-theme-bootstrap` | 0.7.0 | Full support TODO release bootstrapv4 branch to npm
`epub-website` | --- | Full support
