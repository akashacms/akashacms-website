---
layout: article.html.ejs
title: AkashaCMS' built-in plugin
rightsidebar:
---

AkashaCMS provides one plugin with a few generally useful partials, and a layout page.  They work together to provide a comprehensive base page layout.

The layout file, `ak_page.html.ejs`, produces an HTML5 page loosely derived from the HTML5 Boilerplate project.  It's built using these partials:

* `ak_headermeta.html.ejs` Contains a comprehensive list of meta tags letting you specify any SEO parameter desired.
* `ak_sitemap.html.ejs` Declares a `sitemap.xml` file.
* `ak_siteverification.html.ejs` Meta tags for verifying the site with Google.
* `ak_stylesheets.html.ejs` References a set of stylesheets that are listed in `config.headerScripts.stylesheets`.
* `ak_javaScript.html.ejs` References a set of JavaScript files, that are listed in `config.headerScripts`.
* `ak_googleAnalytics.html.ejs` Sets up Google Analytics code.

[OpenGraph protocol documentation](https://developers.facebook.com/docs/opengraph/) - Some tags supported by `ak_headermeta.html.ejs` are OpenGraph.