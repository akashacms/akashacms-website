---
layout: blog.html.njk
title: AkashaEPUB received nearly complete rewrite - hugely simplified
publicationDate: May 19, 2015
blogtag: news
teaser: The initial version of AkashaEPUB demonstrated the need to hugely simplify book configuration.  That's been done.
---

While AkashaEPUB was very important for producing EPUB's that pass the EPUB3 epubchecker program, getting the configuration right was a little tedious.  Explaining the configuration in the AkashaEPUB Guide took a long time, and dotting i's and crossing t's meant constantly going from detail to detail, and basically fiddling.  After some thought a couple things became clear

* The chapter/section metadata needed to be IN the document file.
* The chapter/section hierarchy can be IN the document files.
* No need to explicitly list the asset files.
* No need for the `config.js` file - maybe - a YAML file might be easier to deal with
* etc

The AkashaEPUB target audience doesn't care about the AkashaCMS underpinnings, they just want to write their book.  Hence, the need is for as little configuration as possible, to let the author focus on their content.

Hence, the Gruntfile has a hugely abbreviated Config object.  There's a lot of opinions built into AkashaEPUB's code about the physical directory layout for a book project.  For example, the author had been free to name the `root_docs` or `root_partials` directories anything they like.  Now, if they leave that piece of configuration out AkashaEPUB will detect whether a `documents` or `partials` directory exists and set up those config arrays as appropriate.

That pattern is followed for every `config.js` option.  The value can be left out of the config object in `Gruntfile.js`, and AkashaEPUB will substitute in a sensible default value automatically detecting (where appropriate) what value to use.

All this is new for AkashaEPUB 0.4.9.  The epub-skeleton has been updated to the new configuration, and I added a more complex directory structure to test different content linking structures.

As it stands the epub-guide content is out-of-date.  It builds with the new AkashaEPUB, but the documentation is for the old AkashaEPUB.  I'll rewrite the guide shortly.
