---
layout: blog.html.ejs
title: Viewer.js, a powerful pure-JavaScript document viewer to simplify your visitors document experience
publicationDate: 2014-05-01 19:37
blogtag: news
teaser: |
    I hate the typical user experience around viewing and distributing PDF files (or other document formats).  Usually we're forced to download the file to our local computer, then view it using a separate viewer.  It litters the Downloads directory with old files we've downloaded, and it's somewhat jarring to find yourself suddenly having to navigate to a separate viewer application.  Further, an external viewer probably doesn't work well on a mobile device where the operating paradigm is quite different from desktop computers.
---


Therefore, your visitors will be better served by, instead of having them download a PDF file, if they can view it directly in their browser.  Just like with audio or video viewers, a document viewer simply resides inside the browser frame and the visitor can view the document without leaving the browser.  Because the document is downloaded by the browser cache, it doesn't litter the downloads directory, and the browser will manage the cache'd copy of the document  A much better user experience is had by all.  Especially if this can be accomplished with pure JavaScript and not a browser plugin.

What I've done in the past is use the Google Docs Viewer to provide an embedded Viewer to my visitors.  While that's a powerful viewer application that can handle dozens of file formats, it has two limitations:  First, the visitor has to be logged into their Google Account (if they have one).  Second, there is some kind of bandwidth cap and the visitor might see an error message rather than the document.

I've decided to abandon Google Docs Viewer because of those reasons.  I'd learned that PDF.js, a new component in Mozilla that handles PDF viewing, can be used standalone, but it's pretty complex.  Fortunately a team of people have created the <a href="http://viewerjs.org/">Viewer.js</a> project, which uses PDF.js and a couple other libraries to provide a document viewer any website author can use, and supports a couple additional document formats to boot.  It's not quite as good as Google Docs Viewer, but it'll improve as the Mozilla team improves PDF.js.

Using the library is pretty simple - the website has good instructions for you to follow.  I've set up a <a href="http://webmaster-tips.davidherron.com/javascript-ui/viewerjs.html">demo page</a> so you can see how to use it.

I've also implemented Viewer.js support in <a href="http://akashacms.com">AkashaCMS</a> that makes it very easy.  See https://github.com/akashacms/akashacms-document-viewers

In your `config.js` file include this plugin:

```
require('akashacms-embeddables')
```

The Document Viewers plugin supports embedded content like Youtube videos.  It supports setting up a Google Docs Viewer, and it can now use Viewer.js for the same purpose.

Viewer.js has two modes:  
* a stand-alone page viewing the document in the full browser viewport
* embedded in the page.  See the <a href="/plugins/document-viewers/index.html">Document Viewers plugin documentation</a> for more information.
