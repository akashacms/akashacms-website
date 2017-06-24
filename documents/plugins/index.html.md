---
layout: default.html.ejs
title: AkashaCMS plugin directory
rightsidebar:
useNewSiteNavbar: true
---

These are the known plugins for AkashaCMS.  We say "known" because the AkashaCMS plugin system allows anybody to write a plugin and not inform us of its existence.  Instructions for adding to this list are given below.

See [the documentation on writing a plugin](/new/akasharender/plugins-writing.html) for more information.

<ul class="list-group">
<li class="list-group-item"><a href="built-in/index.html">AkashaCMS built-in</a> Provides foundation-level support for any HTML</li>
<li class="list-group-item"><a href="base/index.html">AkashaCMS-base</a> Provides foundation-level support for building websites</li>
<li class="list-group-item"><a href="booknav/index.html">AkashaCMS-booknav</a> Provides book-like navigation of content</li>
<li class="list-group-item"><a href="blog-podcast/index.html">akashacms-blog-podcast</a> Provides a river-of-news presentation for blog posts</li>
<li class="list-group-item"><a href="breadcrumbs/index.html">akashacms-breadcrumbs</a> Provides a breadcrumb trail to aid navigation</li>
<li class="list-group-item"><a href="document-viewers/index.html">akashacms-document-viewers</a> Embeds documents (PDF, etc) in-line</li>
<li class="list-group-item"><a href="embeddables/index.html">akashacms-embeddables</a> Assists with embedding content from other sites</li>
<li class="list-group-item"><a href="footnotes/index.html">akashacms-footnotes</a> Adds footnote-style citations at the bottom of the page</li>
<li class="list-group-item"><a href="tagged-content/index.html">akashacms-tagged-content</a> Categorizing content by adding tags.</li>
<li class="list-group-item"><a href="theme-bootstrap/index.html">akashacms-theme-bootstrap</a> Use Twitter Bootstrap to improve website look and feel.</li>
<li class="list-group-item"><a href="adblock-checker/index.html">Adblock Checker</a> Detect if advertising has been blocked, and display a message</li>
<li class="list-group-item"><a href="affiliates/index.html">Affiliate links</a> Simplify using affiliate links</li>
</ul>


------------------------------------

# Adding plugins to the directory

One registers a plugin on this page by issuing a pull request on the [source code for this website](https://github.com/robogeek/akashacms-website).

At the minimum the pull request should add an item to the list above.  If you wish to host the plugin documentation yourself, then make the link point to your website.  Making the plugin documentation appear on this website requires a bit more work.

First, add the necessary dependency to the `package.json`.  Plugin documentation is stored in the plugins `guide` subdirectory.

Second, add an entry in `config.js` to mount `node_modules/plugin-name/guide` into the website.  Several of these mounts already exist, so simply follow the pattern in the configuration.

Third, use these layout templates:

* `plugin-documentation.html.ejs`
