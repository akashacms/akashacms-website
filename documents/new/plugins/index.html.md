---
layout: default.html.ejs
title: AkashaCMS plugin directory
rightsidebar:
useNewSiteNavbar: true
---

These are the known plugins for AkashaCMS.  We say "known" because the AkashaCMS plugin system allows anybody to write a plugin and not inform us of its existence.  Instructions for adding to this list are given below.

See [the documentation on writing a plugin](../configuration/ab-plugins.html) for more information.  TODO FIX THIS URL TO NEW PLUGIN DOCUMENTATION

<ul class="list-group">
<li class="list-group-item"><a href="base/index.html">AkashaCMS-base</a> Provides foundation-level support for building websites</li>
<li class="list-group-item"><a href="adblock-checker/index.html">Adblock Checker</a> Detect if advertising has been blocked, and display a message</li>
</ul>


------------------------------------

# Adding plugins to the directory

One registers a plugin on this page by issuing a pull request on the [source code for this website](https://github.com/robogeek/akashacms-website).

At the minimum the pull request should add an item to the list above.  If you wish to host the plugin documentation yourself, then make the link point to your website.  Making the plugin documentation appear on this website requires a bit more work.

First, add the necessary dependency to the `package.json`.  Plugin documentation is stored in the plugins `guide` subdirectory.

Second, add an entry in `config.js` to mount `node_modules/plugin-name/guide` into the website.  Several of these mounts already exist, so simply follow the pattern in the configuration.

Third, use these layout templates (TODO IS THIS SUFFICIENT?):

* `plugin-documentation.html.ejs`
