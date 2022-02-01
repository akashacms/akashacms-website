---
layout: blog.html.njk
title: Converted mahabhuta to TypeScript
publicationDate: January 31, 2022
blogtag: news
teaser: |
    TypeScript improves over regular JavaScript by adding compile time type checking, which helps catch certain errors early before you ship code.  I'm hoping to improve AkashaCMS quality by moving to TypeScript.  Continuing the trial, I've converted Mahabhuta to TypeScript.
heroPicture:
    url: /img/typescript-logo.png
---

The converted modules are

* _Stacked Directories_ ([pull request](https://github.com/akashacms/mahabhuta/pull/16)) which sits at the core of AkashaRender

This continues what was discussed in: [](/news/2022/01/typescript-conversions.html)

The conversion to TypeScript involved splitting each class definition out to separate files.  How very like what Java programmers do, which is to define one class per source file.  TypeScript of course doesn't enforce such a restriction, and the code could have all remained in one file.  But as I worked with it, this seemed like a way to make each file simpler to manage.

There was only one change in behavior or API.  In `0.7.9` and earlier the `process` function was a pure callback oriented method.  It now returns a Promise, and passing the callback is now optional.  Hence it is now safe to use `process` in `async/await` settings.

Another task accomplished was extensive internal documentation.  That's in preparation for using TypeDoc to generate API documentation.
