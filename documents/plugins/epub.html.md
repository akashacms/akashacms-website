---
layout: article.html.ejs
title: AkashaEPUB, Creating EPUB books with AkashaCMS (akashacms-epub)
rightsidebar:
teaser: Leveraging AkashaCMS's ability to render HTML files, AkashaEPUB provides tools for building EPUB 3 documents.
---

<img src="/akashaepub-logo.jpg" align="right"/>Do you want to write an electronic book while using light-weight open source tools?  Maybe you're a programmer and are more comfortable in a programmers editor than in a Word Processor.  Maybe you prefer Markdown for writing e-books, or you don't like the HTML that's exported out of word processors.  Maybe you want a simple lightweight low cost eBook publishing system.  Whatever the reason, the typical method for writing an e-book (MS Word or Libre Office or Pages) isn't for everyone.  Some of us like lightweight plain text editors.

What AkashaCMS does for building websites, AkashaEPUB does for electronic books.  It produces EPUB documents from the same input files you'd use in an AkashaCMS website.  That means being able to write your book using Markdown, for ease of writing, and use a simplified description of e-book structure and metadata in the `config.js` file to round out the eBook publishing process.

See [https://github.com/akashacms/epub-guide](https://github.com/akashacms/epub-guide) for a complete book, buildable with AkashaEPUB, which describes how to build EPUB books using AkashaEPUB.  That git repository is a working example which shows what to do, and [https://github.com/akashacms/epub-skeleton](https://github.com/akashacms/epub-skeleton) is another repository containing a book skeleton you can use as a starting point.

The guide is available for purchase via the following eBook markets: <a rel="nofollow" href="http://www.amazon.com/gp/product/B00WTKDH72/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00WTKDH72&linkCode=as2&tag=thereikipage&linkId=KNAHZZXXUDREI7YJ">Amazon.COM</a>, <a rel="nofollow" href="https://www.scribd.com/doc/263453449/Create-eBooks-with-Markdown-and-Open-Source-Tools">Scribd</a>, the Google Play store, and the Apple iBooks store.

Quick start:

Install AkashaCMS and Grunt:

```
    $ sudo npm install -g akashacms
    $ sudo npm install -g grunt-cli
```

Then install the epub-guide and epub-skeleton, and build the books

```
    $ git clone https://github.com/akashacms/epub-guide.git
    $ cd epub-guide
    $ npm install
    $ grunt doepub
```

Then for the skeleton

```
    $ git clone https://github.com/akashacms/epub-skeleton.git
    $ mv epub-skeleton newBookName
    $ cd newBookName
    $ npm install
    $ grunt doepub
```

For bugs and feature requests in AkashaEPUB, go to [https://github.com/akashacms/akashacms-epub/issues](https://github.com/akashacms/akashacms-epub/issues/).  Or for AkashaCMS, go to  [https://github.com/akashacms/akashacms/issues](https://github.com/akashacms/akashacms/issues/).

The projects are open for code contributions via these repositories

* [https://github.com/akashacms/akashacms](https://github.com/akashacms/akashacms/)
* [https://github.com/akashacms/akashacms-epub](https://github.com/akashacms/akashacms-epub/)
* [https://github.com/akashacms/epub-guide](https://github.com/akashacms/epub-guide/)
* [https://github.com/akashacms/epub-skeleton](https://github.com/akashacms/epub-skeleton/)

<script type='text/javascript'>if(window.shopActive){sellItemFullBuyNow('1');}</script><noscript><a href='https://ecommerce.shopintegrator.com/ecommerce?ci=me0000151114&amp;op=sifbn&amp;ID=1' target='sifbn_1'><img src='https://ecommerce.shopintegrator.com/ecommerce.png?ci=me0000151114&amp;op=sifbn&amp;ID=1' border='0'/></a></noscript>