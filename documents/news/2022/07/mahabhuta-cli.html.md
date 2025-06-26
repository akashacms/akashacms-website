---
layout: blog.html.njk
title: Mahabhuta has CLI tool for command-line DOM processing
publicationDate: July 24, 2022
blogtag: news
teaser: |
    While Mahabhuta is the package giving AkashaCMS its server-side DOM processing ability, it is potentially useful separately from AkashaCMS.  The new CLI mode for Mahabhuta allows DOM processing in command-line scripts, and could be useful in developing or testing Mahafuncs.
heroPicture:
    url: /news/2022/04/img/freely-reusing-your-content.jpg
---

Mahabhuta is a word from the same Sanskrit lineage where I found the word Akasha.  According to Wikipedia, Akasha is the Sanskrit word for the primordial element from which the universe was constructed.  Mahabhuta is the collective name for all five elements (earth, air, fire, water, spiritual-essence-space).  Because the Mahabhuta package deals with processing HTML or XHTML DOM, this seemed fitting.

The Mahabhuta CLI lets you specify on the command line an input file, zero or more Mahafunc libraries, metadata files, and configuration files.  It then processes the input file using all these things, producing an output file.

Mahafuncs perform DOM processing actions using a jQuery-like API provided by Cheerio.  Mahafuncs are JavaScript/TypeScript classes with specific methods and behaviors.  One of those is the `process` function which does the DOM processing defined for the Mahafunc.

Because it uses _Cheerio_, Mahabhuta allows you to reuse any jQuery knowledge you have from front-end coding in server-side coding.

## Input and output

The Mahabhuta CLI processes an input file and produces output.

```
$ npx mahabhuta input-file.html --output output-file.html
$ npx mahabhuta input-file.html -o output-file.html
$ npx mahabhuta input-file.html
```

The `--output` option specifies an output file, and `-o` is its alias.  If neither exists on the command line, then the output is sent to `stdout`.
<!-- 
## Mahafunc libraries, a.k.a. Mahafunc Arrays


## Mahafunc array configuration

## Partial templates, partial directories, metadata

## Cheerio configuration
-->

