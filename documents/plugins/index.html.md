---
layout: default.html.ejs
title: AkashaCMS plugin directory
rightsidebar:
useNewSiteNavbar: true
---

These are the known plugins for AkashaCMS.  We say "known" because the AkashaCMS plugin system allows anybody to write a plugin and not inform us of its existence.  Instructions for adding to this list are given below.

See [the documentation on writing a plugin](/akasharender/plugins-writing.html) for more information.

Plugin | Description
-------|-------------
[AkashaCMS built-in](built-in/index.html) | Provides foundation-level support for any HTML
[AkashaCMS-base](base/index.html) | Provides foundation-level support for building websites
[AkashaCMS-booknav](booknav/index.html) | Provides book-like navigation of content
[akashacms-blog-podcast](blog-podcast/index.html) | Provides a river-of-news presentation for blog posts
[akashacms-breadcrumbs](breadcrumbs/index.html) | Provides a breadcrumb trail to aid navigation
[akashacms-document-viewers](document-viewers/index.html) | Embeds documents (PDF, etc) in-line
[akashacms-embeddables](embeddables/index.html) | Assists with embedding content from other sites
[akashacms-external-links](external-links/index.html) | Useful manipulations to outbound links
[akashacms-footnotes](footnotes/index.html) | Adds footnote-style citations at the bottom of the page
[akashacms-tagged-content](tagged-content/index.html) | Categorizing content by adding tags
[akashacms-theme-bootstrap](theme-bootstrap/index.html) | Use Twitter Bootstrap to improve website look and feel
[Adblock Checker](adblock-checker/index.html) | Detect if advertising has been blocked, and display a message
[AkashaEPUB](akasharender-epub/index.html) | Convert rendered HTML for use in an EPUB
[Affiliate links](affiliates/index.html) | Simplify using affiliate links

<!-- 
<ul class="list-group">
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="built-in/index.html">
        AkashaCMS built-in</a> Provides foundation-level support for any HTML</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="base/index.html">
        AkashaCMS-base</a> Provides foundation-level support for building websites</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="booknav/index.html">
        AkashaCMS-booknav</a> Provides book-like navigation of content</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="blog-podcast/index.html">
        akashacms-blog-podcast</a> Provides a river-of-news presentation for blog posts</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="breadcrumbs/index.html">
        akashacms-breadcrumbs</a> Provides a breadcrumb trail to aid navigation</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="document-viewers/index.html">
        akashacms-document-viewers</a> Embeds documents (PDF, etc) in-line</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="embeddables/index.html">
        akashacms-embeddables</a> Assists with embedding content from other sites</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="external-links/index.html">
        akashacms-external-links</a> Useful manipulations to outbound links</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="footnotes/index.html">
        akashacms-footnotes</a> Adds footnote-style citations at the bottom of the page</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="tagged-content/index.html">
        akashacms-tagged-content</a> Categorizing content by adding tags.</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="theme-bootstrap/index.html">
        akashacms-theme-bootstrap</a> Use Twitter Bootstrap to improve website look and feel.</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="adblock-checker/index.html">
        Adblock Checker</a> Detect if advertising has been blocked, and display a message</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="akasharender-epub/index.html">
        AkashaEPUB</a> Convert rendered HTML for use in an EPUB</li>
<li class="list-group-item">
    <a type="button" class="btn btn-link" href="affiliates/index.html">
        Affiliate links</a> Simplify using affiliate links</li>
</ul>
-->

------------------------------------

# Adding plugins to the directory

One registers a plugin on this page by issuing a pull request on the [source code for this website](https://github.com/robogeek/akashacms-website).

At the minimum the pull request should add an item to the list above.  If you wish to host the plugin documentation yourself, then make the link point to your website.  Making the plugin documentation appear on this website requires a bit more work.

First, add the necessary dependency to the `package.json`.  Plugin documentation is stored in the plugins `guide` subdirectory.

Second, add an entry in `config.js` to mount `node_modules/plugin-name/guide` into the website.  Several of these mounts already exist, so simply follow the pattern in the configuration.

Third, use these layout templates:

* `plugin-documentation.html.ejs`
