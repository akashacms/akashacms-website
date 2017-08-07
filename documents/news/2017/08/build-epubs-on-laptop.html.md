---
layout: blog.html.ejs
title: Building EPUB electronic books and websites on your laptop, no server-side tools required
publicationDate: August 6, 2017
blogtag: news
teaser: |
    <p>Yesterday I announced the 2nd edition of <em>Creating eBooks with Markdown and Open Source Tools</em> is available on the Amazon Kindle store, and will be available on other marketplaces soon.  I also tangentially talked about the lack of other tools with similar capabilities.  It seems from my incomplete survey of the market that software to create EPUB's or static HTML websites usually require either an installed server-side rendering system, or else a heavy-weight WYSIWYG desktop-publishing application.  </p>

    <p>What the AkashaRender, AkashaCMS, AkashaEPUB system offers is lightweight tools that run on your laptop yet produce websites or EPUB's built using the latest web techniques. </p>

    <p>Let's talk about that for a bit.</p>
---

AkashaCMS is a static website system built using AkashaRender and a small group of plugins.  Part of the system is Mahabhuta, a system to do server-side DOM manipulation of HTML for example to construct a custom tag like `<embed-resource href="https://twitter.com/AkashaCMS/status/565602061681971200"/>` to cause embeddable content from a 3rd party site to be easily embedded into this website:

<embed-resource href="https://twitter.com/AkashaCMS/status/565602061681971200"></embed-resource>

AkashaEPUB is a system to build EPUB's (electronic books) from the same content files you'd use in an AkashaCMS website.  While an AkashaEPUB project can use some of the plugins meant for AkashaCMS, there are a couple plugins specifically for producing EPUB's.  The system includes the _epubtools_ application which handles bundling files into a standards-correct EPUB3 file.

With a little work the content you write for an EPUB can also be incorporated into an AkashaCMS website.  For example I have two books published in the Kindle store that are also published as website content:

* https://akashacms.com/epubtools/toc.html -- this book documents AkashaEPUB
* https://greentransportation.info/ev-charging/toc.html -- A best-practices guidebook about charging electric cars.

I hope you recognize from this website, from the GreenTransportation.info website, and from the eBooks I just named, that this system is powerful.  It is also very easy to use, and it runs very easily on my laptop.

The most difficult step is actually very easy -- installing Node.js.  See [](https://akashacms.com/epubtools/2-installation.html)

Once you've installed Node.js, getting started with using the tools is next to trivial.  For example, setting up an electronic book project is this simple:

```
$ git clone https://github.com/akashacms/epub-skeleton.git
Cloning into 'epub-skeleton'...
remote: Counting objects: 65, done.
remote: Total 65 (delta 0), reused 0 (delta 0), pack-reused 65
Unpacking objects: 100% (65/65), done.
$ mv epub-skeleton newBookName
$ cd newBookName
$ npm install
.... much output
$ npm run rebuild
.... much output
$ ls -l skeleton.epub
-rw-r--r--  1 david  staff  129265 Jul  8 22:47 skeleton.epub
```

The `epub-skeleton` project is set up to be an example project you can use as a starting point.  Those steps require maybe two minutes, and the `skeleton.epub` file can be opened in any EPUB reader application.

Likewise, setting up a website project is very simple:

```
$ git clone https://github.com/akashacms/akashacms-example.git
$ git clone https://github.com/akashacms/akashacms-skeleton.git directoryName
$ cd directoryName
$ npm install
$ .... start hacking
$ npm run build
$ npm run preview
```

These tools are extremely light-weight and run on the command line.  You edit the files in regular text editors -- I'm using Atom (https://atom.io) to edit this file, for example.  While you don't get a WYSIWYG experience, Atom does have a 3rd party Markdown previewer that gets you a long ways in that direction.  Plus, rebuilding an EPUB or a website can take a very short time, and you can quickly reload an EPUB reader or website previewer in the browser.

By contrast let's take a look at Gitbook.  It's a hosted system that offers a lot of flexibility in writing eBooks.  It can publish to PDF, to EPUB, and a couple other formats.  It seems to be a popular system, since the Gitbook website shows hundreds of online eBooks built using Gitbook.

But ... you can only use Gitbook tools via their website.  You don't install Gitbook tools on your laptop, but access them over the web, storing your content on their server.

Look at the above examples -- you see an EXISTENCE PROOF that the tools necessary to render EPUB's can be lightweight enough to run on a laptop with no problem.  It doesn't even require a powerful high-end laptop.  In the past I extensively used a Chromebook that had been hacked (with Crouton) to run Linux in the background.  Chromebooks like this one have a low-powered CPU and often they have only 2GB or 4GB of memory.  Yet, the AkashaCMS/AkashaEPUB tools run extremely well on the Chromebook.

The question is -- WHY entrap your content in a 3rd party service?

At least with Gitbook your content is in Markdown and could be easily imported into other tools.  It'd probably be easy to convert a Gitbook-based eBook into the format required by AkashaEPUB.  With other tools that's not so simple.

Publishing a Gitbook-based book online is as simple as clicking a button, and Gitbook's servers host the content.  But what if you want your content incorporated into your website?

With AkashaCMS/AkashaEPUB not only do you render/publish your content from your laptop, it's trivially easy to integrate eBook content into your website.  It's your content, shouldn't you have the flexibility of controlling the publishing of that content?
