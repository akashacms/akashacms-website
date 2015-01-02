---
layout: article.html.ejs
title: Markdown support in AkashaCMS - CommonMark with a few Github Flavored Markdown extensions
rightsidebar:
publDate: Jan 1, 2015
author: david
---

As noted in <a href="/documents/extensions.html"></a>, AkashaCMS uses the [Remarkable](https://github.com/jonschlinkert/remarkable) markdown processor.  This gives us quite a lot of capabilities, as well as a focus on the [CommonMark](http://commonmark.org/) spec.  As nice as Markdown is, the original "specification" was not terribly precise leading to some fragmentation among the various Markdown processors.  The CommonMark spec aims to fix that, opening a route to a day of compatibility between Markdown processors.

The Remarkable engine has a number of configuration options to customize the output and what it does.  At the moment AkashaCMS has a fixed configuration hidden in its internals.  It would be fairly easy to allow `config.js` to contain configuration options allowing a website to precisely configure its operation.  If that's desired, please file an issue and we'll take care of it.

Perhaps the most useful thing is that Remarkable adopts the [Tables](https://help.github.com/articles/github-flavored-markdown/#tables) markup from Github Flavored Markdown.

That means:

```
First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell
```

Renders to

First Header  | Second Header
------------- | -------------
Content Cell  | Content Cell
Content Cell  | Content Cell

It also supports "strikethrough text" where `~~deleted text~~` renders as ~~deleted text~~.