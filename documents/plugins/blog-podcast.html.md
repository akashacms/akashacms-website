---
layout: article.html.ejs
title: Blog & Podcast support
publicationDate: Feb 10, 2015
author: david
---

Blogging (and podcasting) are common uses for websites.  The `akashacms-blog-podcast` plugin is an initial attempt to support that use case.

To install add `akashacms-blog-podcast` to the site `package.json` and then type "npm install".  After that, in the `config` function in your `config.js` add this to the `registerPlugins` statement.

    akasha.registerPlugins(module.exports, [
        ...
        { name: 'akashacms-blog-podcast', plugin: require('akashacms-blog-podcast') },
        ...
    ]);

Before starting to configure the plugin, let's discuss the principles.

The `akashacms-blog-podcast` plugin supports multiple blogs on an AkashaCMS website.  It's just a matter of adding enough configuration information to `config.js`, one set of data per blog.

The plugin is designed around the notion that a blog is simply a website with an RSS feed, and with an index page where the items are presented in reverse chronological order.  There's nothing magical about a blog, and at the core the presentation of items in reverse chronological order is the essence of every blogging platform.

We define which pages belong to a blog, and which blog to which the pages belong, using a Matcher object.  It's very unlikely that every page on an AkashaCMS site would be part of any blog hosted on the site.  And, to support multiple blogs per site, it's necessary to clearly define which blog a posting belongs to.

Matcher objects let us select a subset of the documents on the site based on parameters in the Matcher.  Each blog has a Matcher, defining the parameters which define what pages belong to the blog.

The [Announcements and News](/news/index.html) portion of this website is built using this plugin.

In `config.js` define this object to hold the module configuration:

	blogPodcast: {
        ...
    }

Each blog is defined by an object within this, for example:

	blogPodcast: {
		"news": {
			rss: {
                .... RSS parameters
			},
			rssurl: "/news/rss.xml",
			matchers: {
				layouts: [ "article.html.ejs" ],
				path: /^news\//
			}
		}
	},

This defines a blog named `news`.  The matcher says that files using the `article.html.ejs` layout and whose path begins with `news/` are part of the blog.

While you could simply put documents within the `news/` directory, after awhile you'll find a large number of postings piling up and the directory might become unweildy.  The News blog on this site uses a directory structure under the `news/` directory such that documents in the `news/2015/02` directory were created in February 2015, and so on.  It's up to you what you do.  The `path` matcher will retrieve every document whose pathname matches the regular expression.

The RSS parameters section are as documented for the [RSS package](https://www.npmjs.com/package/rss).  They define the content in the main body of the RSS feed.

Adding Podcast support appears to simply require specifying the custom parameters, as is shown on the package page, but that hasn't yet been tested.  Remember that a Podcast is simply an RSS feed with additional media elements and enclosure tags.

The `rssurl` parameter specifies where, within the rendered website, the RSS file will be installed.  It also is used in a couple places as a URL.  It must start with a '/' and therefore be relative to the website root directory.

At this point you have a page layout (or multiple page layouts) for blog entries, and have defined which pages on the site are included in the blog.  The next step is the index page for the blog.

You can create a file in layouts, `layouts/index-blog.html.ejs` containing something like this:

    ---
    layout: default.html.ejs
    ---
    <%- content %>
    <blog-news-river></blog-news-river>

The layout specified here should define the overall page layout.  You should already have such a layout file on the site.

The main key is the `<blog-news-river></blog-news-river>` tag, which invokes code in the `akashacms-blog-podcast` plugin.

Next create a page that will be the index for the blog, for example `news/index.html.md`, containing something like this:

    ---
    layout: index-blog.html.ejs
    title: Announcements and News about AkashaCMS
    blogtag: news
    ---

This is rendered with the `index-blog.html.ejs` layout we just defined.

The `blogtag` tag in the frontmatter defines which blog definition to use.  The `blog-news-river` tag looks for the `blogtag` value, to look up the blog configuration.

With the blog configuration, the `blog-news-river` tag will use the defined Matchers to select the items, sort them into reverse chronological order, and render both an RSS feed and the index page.  The index page is rendered using the partial `blog-news-river.html.ejs`.

## Podcasting?

As noted above, the RSS package claims to support Podcasting by adding some custom data elements.  This hasn't been tested, yet.
