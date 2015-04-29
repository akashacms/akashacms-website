---
layout: blog.html.ejs
title: AkashaEPUB 0.4.6 released, Guidebook posted to eBook stores
publicationDate: April 28, 2015
blogtag: news
teaser: Achieved a major goal with AkashaEPUB - the guidebook has been successfully uploaded to several online eBook marketplaces.
---

<a href="/plugins/epub.html"><img src="/akashaepub-logo.jpg" align="right"/></a>My goal for implementing [AkashaEPUB](/plugins/epub.html) was to launch a business selling books via online eBook marketplaces like Amazon or Google Play or Apple's iBook store.  I have some things to say, and think publishing via an eBook or many eBooks is a great way to go.  In order to test AkashaEPUB and prove that it does what it claims on the label, I wrote the Guidebook with the goal of uploading it to as many markets as I could find.

<img src="/akashaepub-guide-cover.jpg" align="right" style="max-width: 400px;"/>The good news is that four major eBook marketplaces accepted the Guidebook without hiccup.  The Guidebook is now on sale on those marketplaces, proof positive that AkashaEPUB does what it says on the tin.

**Kindle Direct** (amazon.com) [https://kdp.amazon.com/](https://kdp.amazon.com/dashboard) -- This is the big banana of the eBook marketing world, so it was the first site on my list.  The process went very easily.  

You click on the "Add New Title" button (once logged in) and start filling in the form with data.  You have to upload the cover image separately, add the book title by typing it in, and a couple other steps which could have been handled automatically if Amazon's website were to have you upload the EPUB first.  However, Amazon's workflow wants to support you uploading any old document and therefore they ask for information that is already present in the EPUB.

I was pleasantly surprised that Amazon allows uploading an EPUB rather than forcing you to use the KindleGen tool and upload the MOBI file which results.  

RESULT: <a rel="nofollow" href="http://www.amazon.com/gp/product/B00WTKDH72/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00WTKDH72&linkCode=as2&tag=thereikipage&linkId=KNAHZZXXUDREI7YJ">Creating eBooks with Markdown and Open Source Tools (amazon.com)</a>


**Google Play Bookstore** (play.google.com) [https://play.google.com/books/publish/](https://play.google.com/books/publish/) -- The Google Play Store is another large eBook marketplace.  It's very easy to sign up to sell books or anything else.

Uploading a book is easy -- you upload the EPUB, their service automatically extracts a bunch of data, and the only additional information you have to add is the sales copy and your author bio.  I knew there'd be no problem because of using this same service to test the book.  I'd been uploading test versions of the Guide to my Google Play Books, then reading it on my iPad and browser.

**Scribd** (scribd.com) -- The Scribd service is geared to people reading books online, or via Scribd's mobile device apps, and paying a monthly membership fee.  It turned out to be trivially easy to get going.  You just upload the EPUB, add sales copy, and that's it.  There's no review period before the book being live on the site, instead it's visible and available as soon as the book is uploaded.

RESULT: <a href="https://www.scribd.com/doc/263453449/Create-eBooks-with-Markdown-and-Open-Source-Tools" rel="nofollow">Create eBooks with Markdown and Open Source Tools (scribd.com)</a>

**Apple iBook store** (www.apple.com/ibooks/) [https://www.apple.com/itunes/working-itunes/sell-content/books/](https://www.apple.com/itunes/working-itunes/sell-content/books/) -- Apple's iBooks app is the most advanced EPUB Reader software on the planet because it has support for video, audio and JavaScript interactivity.  In other words they're fully exploiting the power available in EPUB3 with its support for HTML5, JavaScript and CSS3.  

You sign up through the above link and it's a little confusing once you're in the iTunes Connect back end what to do.  There is a Resources link leading to some helpful documents that eventually led me to the right things to do.  First you have to fill out a bunch of administrative paperwork, such as your business name and tax documents and so on.  That was pretty straightforward, but a little time consuming because of the extent of the requested information.

It wasn't obvious how to upload books through the website, as the other services do, but that's because you don't use the website to upload books at all.  Instead you use a Mac OS X app named iTunes Producer, available through the iTunes Connect back end.  Producer isn't in the Mac OS X App Store, so don't look for it there.

Once you have Producer running you have some data to fill in about the book, like the cover image, title, etc - some of which it could have extracted from the EPUB but doesn't.  In theory you just click Submit once all the data is there, and you've dragged the book to the application window.  BUT ..

First problem is that the cover image has to be less than 4,000,000 pixels in size.  That meant resizing the image and repackaging the EPUB, not a big deal.

Second problem was that ePubCheck had been telling me this error all along, and iTunes Producer requires the book result in zero errors from ePubCheck

```
ERROR: guide.epub: Mimetype contains wrong type (application/epub+zip expected).
```

Since the mimetype file had that content I was scratching my head over what this meant, and had been ignoring the message thinking it was spurious.  Turns out I hadn't noticed a teensy little detail in the EPUB version 3 spec, that the mimetype file had to be uncompressed.  A little change to the AkashaEPUB plugin, and that was fixed, and now the book has been uploaded to the iBook store.

**Nook Press** [https://www.nookpress.com/](https://www.nookpress.com/) -- This service is run by Barnes & Nobles, and is associated with their Nook eBook reader, but may also be set up to supply printed books in B&N stores.  It's very easy to sign up and get started.  It's very easy to upload an EPUB to the service.  That is, it's easy until the service tells you it can't process the EPUB.  It doesn't explain why, no error messages, just an obtuse statement.

Digging through their help area I did find a document talking about the format for uploaded books -- and it's clear they only support EPUB version 2.  AkashaEPUB unabashadly supports EPUB3 and not EPUB2, so, the NookPress is a no-go zone for eBooks published with AkashaEPUB.
