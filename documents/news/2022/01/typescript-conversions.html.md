---
layout: blog.html.njk
title: Converted Stacked Directories and EPUB Tools to TypeScript
publicationDate: January 28, 2022
blogtag: news
teaser: |
    TypeScript improves over regular JavaScript by adding compile time type checking, which helps catch certain errors early before you ship code.  I'm hoping to improve AkashaCMS quality by moving to TypeScript.  As a trial run two modules have been converted.
heroPicture:
    url: /img/typescript-logo.png
---

The converted modules are

* _Stacked Directories_ ([pull request](https://github.com/akashacms/stacked-directories/pull/1)) which sits at the core of AkashaRender
* _EPUB Tools_ ([pull request](https://github.com/akashacms/epubtools/pull/13)) which handles the packaging for EPUB documents, and is the core of AkashaRender-EPUB ([read full announcement](https://akashacms.github.io/epubtools/news/2022/typescript.html))

At the moment there is no firm plan to do further conversion.
