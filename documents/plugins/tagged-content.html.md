---
layout: article.html.ejs
title: Tags for pages, and tag clouds (akashacms-tagged-content)
rightsidebar:
---

A few years ago tag clouds were all the rage right?  All the cool kids were putting tag clouds on their site.  Some people didn't like them, but they are a somewhat useful navigational aid.  Maybe.  That's debatable.  What isn't debatable is that adding tags to content is useful, especially when coupled with per-tag pages showing all the content which has that tag.

This plugin should still be considered a work in progress, and we are open to suggested changes [via the project](https://github.com/robogeek/akashacms-tagged-content).

It currently supports four features

* Adding tags to a document
* Generating a tag cloud
* Generating a page listing the documents for a given tag
* Generating a list of tags for a given document

What we mean by "tags" is roughly a "keyword phrase".  Drupal, Wordpress and other content management systems let you add tags to each posting.  In Drupal this is called "Vocabulary" and "Vocabulary Terms", while in Wordpress there are both "Categories" and "Tags".  Roughly speaking these boil down to phrases meant to be used for categorization.

The `akashacms-tagged-content` plugin supports only a single pool of tag names.

# Adding tags

Tags get carried in the metadata for a document and it's very simple to tag a page.

    ---
    title:  The Great American Web Page Title
    ...
    tags: Phrase One, Phrase 2, Third Phrase, etc
    ---

The tag list is simply a comma seperated set of phrases.  It doesn't matter too much what the content of each tag is.  The plugin only splits the string on commas, and removes whitespace from both ends.


# Showing Tags for a given document

In one (or more) of your layout templates do something this:

    <p><small>Tags: <tags-for-document></tags-for-document></small></p>

Each tag will link to the index page for that tag

# Tag index page generation

A Tag Index Page lists links to every page that has the given tag.

This feature demonstrates that while AkashaCMS prefers to have a fixed set of documents to work with, it can be used to generate a series of pages that are then rendered.

Because the sites' content determines set of tags for a that site, index page generation has to support generating any number of pages as well as generating the content on each of the index pages.

Generating the tag index pages occurs automatically within AkashaCMS's processing steps.  It does require configuring a couple things into the site.

In `config.js` add an object of this sort:

    taggedContent: {
        pathIndexes: '/tags/',
        header: "---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p>Pages with tag @tagName@</p>"
    },

The plugin looks for this object so it knows what to do.

The `pathIndexes` parameter selects the URL within the site where the index pages will live.  The resulting URL for each tag index page will be

    http://site-domain/tags/tagName.html

The `header` parameter sets up the frontmatter block for the tag index page.  It fills in the page title, and the tagName.  Note that we show here a layout named `tagpage.html.ejs`.  You are free to use a different layout filename if you like.  Make sure to design a suitable page layout for displaying the tag index.

# Tag cloud generation

In one (or more) of your layout templates do this:

    <tag-cloud></tag-cloud>

This uses the `tagcloud-generator` module for some of the heavy lifting.

There are no options.


