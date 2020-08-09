---
layout: blog.html.njk
title: Static HTML website builders (AkashaCMS, etc) slashes web hosting costs to the bone
publicationDate:  2014-04-15 01:52
blogtag: news
teaser: |
    Today's web is supposedly about fancy software on both server and client, building amazingly flexible applications merging content and functionality from anywhere.  What, then, is the role of old-school HTML websites?  In particular, why am I wasting my time building AkashaCMS and not building websites with Drupal?
---
I just announced AkashaCMS version 0.3.x, and it has a bunch of improvements making AkashaCMS a much better system. But, why would anyone want to use it?

I've spent a lot of time learning to use Drupal, started with Drupal v4.6, and am currently earning my living maintaining a Drupal website for a news organization.  Therefore I'm pretty well steeped in Drupal, so shouldn't I use Drupal to build all my websites?  Drupal is very powerful and popular, making it a great choice, right?  Recovery.gov, Whitehouse.gov, Examiner.com, and plenty of huge high profile websites are built with Drupal, so that's good, right? Similar things could be said about Wordpress or whatever system you prefer.

What AkashaCMS (and other static HTML content management systems) do is to flexibly generate HTML files from a set of content files, layout files, partials, and assets. AkashaCMS attempts to implement most of the flexibility of a regular content management system, but at a much lower hosting cost. Static HTML is deliverable by Apache at high speed even from shared hosting, where fancy CMS's like Drupal quickly need a VPS (at higher cost) to maintain adequate performance.

Drupal/Wordpress/etc can do all that, and can do it inside the browser, from a mobile device, etc etc.. so why did I create AkashaCMS? What I came to after several years of Drupal is realizing many websites don't need a big/fancy system.  Key question: If most or all the pages on a website never change, then why should the page be rebuilt on every page view?

That is - most CMS's create an illusion of generating a custom page for every visitor.  That way your visitor could make settings on the site that makes their pages different from every other visitor.  In practice most websites won't take this to an extreme like, say, amazon.com does where it puts personalized recommendations on each page.  The potential for extreme customizability is there, and it means rendering all the page content on every page load.

It's software, right?  We can do that, right?  Well, yes, but it means a large server load to regenerate every page on every page view.  This is expensive, especially if/when it means renting multiple servers for load balancing, proxy/caching, cloud databases, and all that stuff.

Another issue that looms large in my mind is the exportability of content being held by a CMS.  The different CMS's approach this differently, some have a defined export format, and others don't.  Drupal, for example, doesn't have an export format, and while there are a couple contributed modules that attempt to do this, I had bad experiences with them. The result is that content is trapped in the database, and extracting the content means doing some database wizardry, making it a nightmare to transfer content from one CMS to another.

My thoughts in creating AkashaCMS included these:

* Static HTML leverages Apache's best strength, so a site could be delivered at high speed/bandwidth even off shared hosting.
* Flexible templating system for the page composition best practices of the other CMS's
* Generate modern HTML and JavaScript and CSS to stay at the cutting edge
* The maintenance overhead of fancier CMS's is a big burden, sapping my time and keeping me from my primary task of writing content

In other words, with care we can create a website built with modern HTML5 best practices, while not breaking the budget on hosting costs, while retaining most of the flexibility of regular CMS's.

Another benefit of AkashaCMS's design is a distraction-free writing experience.  Writing content for an AkashaCMS website, the file you edit just contains the content, and you're not also staring at all the fru-fru surrounding the content.  Typically your site, when rendered, will have stuff in side bars, footers, headers, maybe embedded in the page, etc.  That's cool, but it's distracting if all that stuff is visible when you're editing content.  Or maybe it's cool to edit content in-place on the page where it's displayed.  I don't really know what's best, I just know that it's cool that when I'm editing a page, that content is all I'm seeing.

Finally, an AkashaCMS website source code can be checked into a source code repository, multiple people can share work on a site that way, etc. That's a kind of flexibility database-oriented CMS's can only dream of.

Maybe I can try to summarize this?

Some websites have needs such that traditional CMS's are overkill. But the traditional way of developing a straight HTML site is clumsy. A system that takes content, applies it to template files, doing it in a flexible manner, can generate sites with most of the flexibility the traditional CMS's offer, but at a fraction of the hosting cost.

That is, for certain classes of websites. You wouldn't implement Facebook with static HTML, but there are zillions of websites with simple needs, with no need to rent a fancy VPS just to run a fancy CMS when all that's needed is a few (?hundred?) HTML pages.
