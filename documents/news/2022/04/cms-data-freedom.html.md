---
layout: blog.html.njk
title: Content Creation Freedom, the Ability to Freely Reuse Your Content on Websites, E-Books, or Anything Else
publicationDate: April 19, 2022
blogtag: news
teaser: |
    Why limit your blog posts, audio or video to just one website?  Creating good quality well structured content (text, audio, video, etc) is a long process.  Most content management systems make it hard to reuse content from one website to another.  Many of us want the freedom to intelligently reuse content on multiple websites, or e-books, but are prevented from doing so by the CMS.  What would "content freedom," similar to "software freedom," or the ability to freely reuse and repurpose content, look like?
heroPicture:
    url: /news/2022/04/img/freely-reusing-your-content.jpg
---

Usually we build websites using content management systems.  We enter content (text, pictures, video, etc) into the system, and and the CMS generates web pages for us.  This is a big step forward from the old days of Dreamweaver, Front Page, or even `/bin/vi`.  Content management systems (CMS's) let us focus on the content while the CMS takes care of page styling, navigational aids, and more.  But, what if we want to reuse our content in multiple formats or publishing venues?  In some cases CMS's hinder reuse.

There's a similar principle in software development, where the free or open source software model counters the traditional closed source, proprietary, software model.  FOSS-compatible (free/open source software) projects guarantee us certain freedoms of downloading, building, and modifying software.  Maybe a similar model of content freedom could be defined for content creation and reuse?  This would guarantee the ability to freely reuse or repurpose the content we have entered into a content management system.

To start the discussion, let's consider three general classifications for CMS's:

1. **Commercial/closed**: Systems which handle hosting the website, storing content, formatting content for display on a website, and much more.  Examples include Medium, Substack, Blogger, Wix, Weebly, Wikidot, etc.  These give you the freedom of simply editing content, and the service provider takes care of the rest.  The cost of your website being under the control of a 3rd party.
1. **Open source database-based**: Systems built on open source code, allowing you to host the website on any compatible web hosting provider.  The content is stored in a database.  Usually, web pages are dynamically built on every page view, though there may be caching of prebuilt pages.  Examples include Drupal, and Wordpress.  These give the freedom of being in control of hosting the website, and control over your domain name.  The cost that your content is stored in a database limiting the flexibility in reusing the content elsewhere.
1. **Open source static website generators**: Systems built on open source code, allowing you to host the website anywhere.  Content is stored as files in the filesystem, and a build process generates HTML/CSS/JavaScript for deployment to a simple web server, Amazon S3, Github Pages, etc.  Examples include Hugo, Jekyll, jocms, Eleventy, AkashaCMS, etc.  These give the freedom of being in control of hosting the website, and control over your domain name, and the ability to easily reuse content in any way you like, since it is just files in the file system..

These systems offer various levels of service, features, utility, openness, and content reuse.  We get the most freedom to reuse data or content with files stored in a filesystem.  Publishing that content to a website requires formatting tools to generate web pages, which is one purpose of content management systems.

I have used different versions of all three of those categories.  While it is convenient to publish using Blogger or Medium, I'm giving them a lot of control over my content, while being hampered from reusing that content elsewhere.  I've used both Drupal and Wordpress extensively, both of which make it hard to export or otherwise reuse the content you enter into the CMS.  I have implemented a static website generator platform, AkashaCMS, where websites are rendered from files stored on the filesystem.  I created AkashaCMS after growing disillusioned over other approaches to publishing websites.

One issue that weighed on my mind is - how to get the content out of the CMS?  It's your content, and you should be able to do whatever you want with it.  In some cases I want to publish e-Books from content posted to my websites.  But, some of these systems make it incredibly difficult to export the data in any form.

There's a thing said about products like cell phones, that if you can't fix the thing do you really own it?  Think of how to apply this idea to publishing websites with CMS's.  Some CMS's limit your freedom to reuse your content.  In that case, do you truly own the content?  You created that content, but what if it's hard or impossible to reuse/repurpose the content?  Does the CMS maker prevent you from being in the drivers seat of your content?

# Examples of exporting content, or reusing on other websites

**Citizen Journalism via Examiner**: Back in 2009, I started a side career in citizen journalism writing news articles about electric vehicles on `examiner.com`.  This was a large website allowing writers (called Examiners) to publish articles that would be seen in news venues like Google News.  But, after a few years, after years of diminishing support, `examiner.com` folded with very little warning.  By then I'd written a thousand news articles, which were about to vaporize.  There was export feature of any kind.  Facing the imminent deletion of a lot of my work, I wrote a Node.js script to scrape the content.  There were many Examiners not as technically adept as I am, who lost their articles.

**Podcast network shutting down**: Several high profile publishing platforms have shut down, not just Examiner.  One, Podango, was an early platform for Podcast publishing.   [Podango existed for a couple years](https://techsparx.com/lifestyle/content-creators/content-platforms.html), then on December 26, 2008 (the day after Christmas) the CEO, Douglas Smith, suddenly announced the service was shutting down, with all files being deleted before New Years Day.  Being a holiday week, most people would be off on vacation and have missed the announcement, only to return and find their podcast had vaporized.   Happy new year!

**Corporate Blogging at Sun Microsystems**: While employed at Sun Microsystems, I was able to write blog posts on both `blogs.sun.com` and `java.net`.  For both there was no method for exporting the content.  After Oracle bought out Sun, they shut down `java.net` and transitioned `blogs.sun.com` to `blogs.oracle.com`.  My blog posts on both sites have therefore disappeared.  For the `java.net` articles, I ended up spending a couple days using the Wayback Machine on `archive.org` to browse the blog posts, and manually extract the content into blog posts on one of my sites.  I haven't made time to do the same for my `blogs.sun.com` articles.

**Switching between blogging platforms**: I started blogging very early using a Java-based tool named Blojsom.  After some time, I switched from that to Drupal, but do not recall how I made that transition.  Some time after that, I wanted to stop paying for an expensive VPS to host Drupal websites, and tried using Blogger or Wikidot for websites.  I wrote a script to help export Drupal content, and import it to Blogger using the Blogger API.  For Wikidot, that required a manual import into the Wikidot CMS.  But later I wanted to switch away from both.  For Blogger, I exported the content to the Blogger XML format, then converted that to a Wordpress XML format, importing to Wordpress.  I do not remember how it worked to export content from Wikidot.

**Exporting from Drupal to static website generator**: Last year I wanted to shut down one of my Drupal websites.  Wouldn't it make sense for Drupal to have a button to export the content?  Because the content is in a database that's easily accessed, you could write SQL queries to do anything you like.  But, that requires learning the database schema, and as Drupal started serving the needs of enterprise websites the schema has grown ever more complex.  Instead, I was able to install a couple modules for content export, [then write a couple simple scripts to massage the data for my needs](/news/2021/11/import-from-drupal.html).  While I managed to export the content from that site, the task was more complex than it should have been.

**Repurposing web content in e-Books**: Some bloggers create e-Books out of their website content.  I think in most cases folks copy and paste the content into a regular word processor like Libre Office.  In my case, I have developed a static website generator tool called AkashaCMS.  The content is stored as Markdown files (with YAML frontmatter) in the file system.  That makes the content immediately reusable, because the files are right there.  A few years ago I learned how to format EPUB e-Books, and worked out how to use AkashaCMS to author EPUB's.  That means the same content can be rendered one way for a website, and rendered another way for an EPUB, and I have authored a few books that way.  Some of those books are also published on websites.

# Some content management systems trap our content

I find it ironic that the open source database-based CMS's offer so much flexibility, but basically entrap your content making it hard to reuse elsewhere.

Since the database-backed CMS's store content in a database, is the content truly trapped?  I pointed out earlier that, with Drupal, the schema is not at all simple.  The content isn't exactly trapped, since it's in a database where we can learn the schema and write SQL queries.  It's more like, the content is in a maze of twisty caverns all alike from a certain computer game in the 1980's.  But since most of the readers probably don't know about Colossal Caverns, and do not know the magic word XYZZY, just consider that your content is stored in difficult-to-navigate database tables.

This isn't just about the ease (or difficulty) of exporting the content.  What about using the content directly from the database of a live site as a data source for other systems?  What if the CMS offered an API to query content?

With open source CMS using databases, anyone could develop an API service that queries the live database.  I see that several GraphQL modules (plugins) are available for Drupal, which would serve that purpose.

# Maintaining freedom of using and reusing content anywhere

The free software movement was about the freedom to access software source code, and to build or modify the software any way you like.  In other words, it's about using and reusing software source code, in whole or in part, anywhere.  The free and open software movement proved to be valuable enough to now be a major force.

Can we apply the same sort of freedom concept to the content we create?

An example of a Free Content Definition (derived loosely from the Free Software Definition at `copyleft.org`) might be:

* The freedom to display the content, for any purpose, on any website, or other venue
* The freedom to edit the content at any level of detail
* The freedom to distribute the content in multiple forms for multiple purposes
* The freedom to distribute modified versions of the content in multiple forms for multiple purposes

For example, a video or audio content creator should be free to publish on not only YouTube but any other video hosting platform, including their own website.  Such a person could edit and transcode the video on their own hardware, storing the master version on their hard drive, then upload to accounts on multiple services.  They could create snippet/teaser videos for posting to Twitter, for promotion.  But, a person who does livestream video through YouTube, without saving that video anywhere, is under the control of the YouTube channel dashboard.

A person writing blog posts might have one system for editing blog post content, and another for publishing the blog post.  For example, Wordpress can be used in headless mode, where the Wordpress dashboard is used for editing, but publishing is handled a different way.  I haven't looked at the details, but there is a GraphQL plugin for Wordpress which promises the ability to separate content editing from presentation.  In general, the content editing environment should support an API (like GraphQL) which enables that to be used by multiple content presentation systems.  By contrast, services like Blogger or Medium offer limited opportunity to export content to enable reusing in other platforms.

# But, wait, there's more to consider 

There's a concept attributed to Ann Rockley, author of Managing Enterprise Content and founder of the annual Intelligent Content Conference:

> Intelligent content is content that’s structurally rich and semantically categorized and therefore automatically discoverable, reusable, reconfigurable and adaptable.

I might quibble about the phrase _intelligent content_ since it seems like an artificially concocted marketing thing.  But, the five stages of this are interesting to ponder:

* _Structurally Rich_ means a consistent, logical, useful organizaton of content/data, structuring it in a way which enables automation.  That's a lot of big words, so it essentially means ensuring that certain kinds of content are stored/edited in a consistent fashion.  For example, the list of electric car charging stations I mentioned earlier is more useful if each entry follows a consistent format.
* _Semantically categorized_ means to add category tags related to the meaning of each thing.  The first stage of this is like the category tags attached to blog posts in Wordpress or the like.  But, there is also _microformat_ tags to consider, where we can attach attributes or tags in certain well defined structures.
* _Automatically discoverable_ means the ability to write software which scans your content using metadata.  One example of this is when search engines consult microformat-based data in web pages, or the meta tags in the header, to access useful information from your website.
* _Reusable_ refers to several things, including the target places where you'll reuse content, using content formats which can be easily converted, and a strategy for controlling who can reuse your content.  An aspect of reuse is the "_create once, publish everywhere_" model.
* _Reconfigurable_ content can be rapidly changed around to meet shifting needs.
* _Adaptive_ content can be reformatted for display based on a number of factors, such as the display device, the context (time, location, etc), or the person to whom the content is displayed.  For example, a website might automatically translate content to a persons language.  Or, it might use responsive design techniques to change the presentation for mobile devices.

# Summary

Implementing this model requires a different sort of content management paradigm than what Wordpress gives us.

My experience is from using AkashaCMS over the last 10 years.  With this, the content is simple Markdown files in the file system, with metadata attached to each file.  The metadata is easy to reuse in several ways to share data between pages within a website.  The content can also be formatted as an EPUB, and I have successfully sold several books through Amazon's Kindle marketplace.  But don't take AkashaCMS to be the be-all-end-all example, it's simply what I developed in my spare time, and have used to build several websites.

<img figure src="/news/2022/04/img/content-rendering-process.png"/>

One possibility to consider is a system that manages content, exposing an API allowing one to mix and match stuff based on API queries.  I don't know exactly what this would look like.  The image is just one idea, since I like the simplicity of files in the filesystem.  While researching this article I found several systems supporting "headless" content management, meaning a content editing dashboard that can be integrated with other systems for rendering websites.  As noted earlier, there is a GraphQL plugin for Wordpress which claims to enable separation between content management, and content presentation.

Another interesting idea are systems for storing image files, that offer a GraphQL API for image manipulation.  In my case, I've got thousands of images related to electric cars and clean energy systems.  These were either my own work, shot with my camera, or supplied by manufacturers (some of whom have gone out of business) for use by the press.  I stored the images in a directory hierarchy that is organized by topic.  But it's sometimes difficult to find the image I want.  Instead, a platform allowing me to query for pictures would help considerably.  And, doing things like automatically adding watermarks, or automatically resizing pictures, would be a big help.

At the end of the day, we need software that helps us do our job.  Software that gets in the way should be avoided, but is sometimes widely used. 
