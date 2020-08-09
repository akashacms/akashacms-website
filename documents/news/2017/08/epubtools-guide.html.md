---
layout: blog.html.njk
title: Published 2nd edition Creating eBooks with Markdown and Open Source Tools
publicationDate: August 5, 2017
blogtag: news
teaser: |
    <p>In June and July, I set about updating the AkashaCMS toolchain to be based on AkashaRender.  The AkashaEPUB toolchain also had to change, and that necessitated a new edition of <em>Creating eBooks with Markdown and Open Source Tools</em>.  This book is the official guide for using AkashaCMS/AkashaEPUB tools to build electronic books.  The major feature addition, despite it being much easier to configure AkashaRender to produce EPUB's, is that you can now publish to both EPUB and Website from the same content. </p>

    <p>I haven't found another system to do that - to publish exactly the same content as either EPUB or a Website.  Okay, that's not quite right since Gitbook can publish to EPUB, MOBI, PDF or online.  However, Gitbook limits you to using their servers which just doesn't make sense.  Rendering EPUB's and Websites is a lightweight lightweight enough to run on your laptop.  Why use a SaaS eBook-publishing system that ensnare's you into using their server?  With AkashaEPUB, you get a light-weight system that can run on any computer, and publish EPUB's or websites.</p>
---

The updated eBook is available on this website - simply click on EPUBTools in the navigation bar.  Or you can find it on [Amazon](http://amzn.to/2fiIk41), and I'll publish it to the Google Play Store and Apple's iBooks shortly.  

Let's back up half a step and explain what this is about.  AkashaEPUB is a name applied to several tools within the AkashaRender/AkashaCMS system that help you publish electronic books in the EPUB3 format.

EPUB3 is the common standard packaging format for electronic books used by most eBook reading systems.  Well, that is, except for the 800-pound-gorilla which is Amazon's Kindle.  However, Amazon is now very good about accepting an EPUB3 file.  They convert the file to their proprietary MOBI-based eBook format.

To understand EPUB3 -- think "ZIP file containing XHTML" and that's pretty close.  For EPUB3 they moved to adopt HTML5, but encoded as XHTML, along with a large amount of CSS3 and even JavaScript.  As the eBook readers improve to adopt those features, we'll be able to publish eBooks with excellent JavaScript-driven interactivity and the same rich styling capabilities we have on web pages.

With AkashaEPUB you edit the Markdown in any kind of simple text editor.  Shortly the system will support AsciiDoc if that's your preference.  You then run a simple script, the steps of which are documented in the book, and within a minute or two your book is formatted and ready to read.

While the system is very easy-to-use, you also have very good control over the specifics.  Almost every field in the OPF and NCX metadata files are declared in a configuration file.  The files are organized in a simple straight-forward manner.  The layout templates are simple and straight-forward.  The content is easily styled using CSS, and it's even easy to incorporate fonts to make your content look nice.
