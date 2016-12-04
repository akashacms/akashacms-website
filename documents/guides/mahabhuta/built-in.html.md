---
layout: ebook-page.html.ejs
title: Using the built-in Mahafuncs
bookHomeURL: '/toc.html'
---

Included with Mahabhuta is a small collection of useful Mahafunc's.  They serve both as an example of Mahafunc implementation, and as basic HTML manipulations to simplify your projects.

The MahafuncArray for these built-in Mahafuncs is available as `mahabhuta.builtin.mahabhuta`.  

Typically you'll have a master MahafuncArray containing other MahafuncArray instances for each group of Mahafunc's.  The Mahabhuta built-in MahafuncArray should be the last in the master list.

```
var mahamaster = new mahabhuta.MahafuncArray("master", {});
mahamaster.addMahafunc(group1.mahabhuta);
mahamaster.addMahafunc(group2.mahabhuta);
mahamaster.addMahafunc(group3.mahabhuta);
mahamaster.addMahafunc(mahabhuta.builtin.mahabhuta);
```

This is to ensure we take advantage of the over-rideability principle.

# SiteVerification -- site-verification

Various services want you to validate ownership of a website or domain by putting special tags in the HTML.  At the moment we only support Google site verification.

USAGE:

```
<site-verification google="code from Google"/>
```

# DNSPrefetch -- dns-prefetch

> DNS prefetching is a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth. This prefetching is performed in the background, so that the DNS is likely to have been resolved by the time the referenced items are needed.  This reduces latency when the user clicks a link.  (from: https://developer.mozilla.org/en-US/docs/Web/HTTP/Controlling_DNS_prefetching)

In other words, this can speed up the user experience by instructing the web browser what content can be prefetched.

USAGE:

```
<dns-prefetch control="on|off" dnslist="url1, url2, url3"/>
```

The first parameter controls whether dns-prefetch is used, by generating this tag:

```
<meta http-equiv="x-dns-prefetch-control" content="on|off">
```

The second parameter is a comma-separated list of URL's which end up generating a corresponding list of these tags:

```
<link rel="dns-prefetch" href="http://www.spreadfirefox.com/">
```

# XMLSitemap -- xmp-sitemap

Several years ago the search engines cooperated on developing an XML based sitemap format that eases the process of indexing websites.  This is extremely important as it helps the search engines properly index your website.

USAGE:

```
<xml-sitemap title="Title Text" href="/path/to/sitemap.xml"/>
```

# ExternalStylesheet -- external-stylesheet

This assists with referencing CSS stylesheets outside the page, that must be loaded from another file.

USAGE:

```
<external-stylesheet href="url" media="optional media type"/>
```

# RSSHeaderMeta -- rss-header-meta

When publishing an RSS feed there are two things to get correct on the page.  One is the HTML block containing the RSS icon, and the link to the RSS feed itself.  The other is metadata to put in the header.  It's helpful for the page layout to declare both of those in the same place.  But then there's the issue of getting the metadata tag into the header.

The `<rss-header-meta>` tag adds the correct tag into the header, if/when the header exists.  It rummages around in the DOM to find the `<head>` section, inserting there this tag:

```
<link rel="alternate" type="application/rss+xml" href="${href}"/>
```

If it finds the `<head>` tag, it inserts the `<link>` tag, and then deletes itself from the DOM.  If this does not happen, then the `<rss-header-meta>` tag is not deleted from the DOM.  Your processing pipeline might, like is done in AkashaCMS, run the Mahafuncs in multiple stages.  In one stage the `<head>` section won't exist, while it will exist in a later stage.

USAGE:

```
<rss-header-meta href="url"/>
```

# Partial's -- partial

The Partial concept is very powerful, since it lets you substitute a large piece of template into one location on the page.  For example you might have boilerplate code that's replicated on every page, such as the group of JavaScript and CSS references, or a navigation toolbar that's the same on every page.  By using a Partial you can avoid replicating that code, and instead keep it in one place.

Implementation is a little more complex than for the other tags, as it will require hooking in some code to find the template file.

USAGE:

```
<partial data-param1="value1" data-param2="value2" file-name="partial.html">
body content of the partial
</partial>
```

The `data-` attributes are made available to the Partial as part of the metadata object.  That is, when `mahabhuta.process` is called, you are to supply a metadata object which can have multiple values.  The `data-` attributes are added to the metadata object, and then supplied to the template file.  The body content is also added to the metadata as `metadata.partialBody`.

What, then, does that mean that the metadata is supplied to the template file?

The answer to that depends on how you implement the next required step to using the `<partial>` tag.  Out of the box `<partial>` will not work, and it instead relies on hooking in code to assist finding the partial file.

```
mahabhuta.builtin.configuration.renderPartial = function(fname, body, data) {
};
```

The `<partial>` tag looks for this function, and calls it.  That function is to supply a Promise, and if that Promise resolve's correctly its value is substituted into the HTML in place of the `<partial>` tag.

The parameters for the `renderPartial` function are straight-forward.  The `file-name` attribute is supplied in the `fname` parameter, the body content is supplied in the `body` parameter, and the computed metadata object is supplied as `data`.

The result of this depends on the function connected here.  Your function may simply read in an HTML file, or it could render it through a template engine.  In AkashaCMS, the `file-name` can be like `navigation.html.ejs` to indicate the EJS engine is used.  Obviously using a template engine brings with it the capability to substitute metadata values into the text.
