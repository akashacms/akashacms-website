---
layout: article.html.ejs
title: Footnotes rendering plugin  (akashacms-footnotes)
rightsidebar:
publicationDate: June 7, 2015
---

The `akashacms-footnotes` plugin supports adding end-note style footnotes to AkashaCMS pages.  The plugin is useful in both AkashaCMS websites, and AkashaEPUB books.

## USAGE

Add a footnote in a document like so 

```
<footnote href="http://www.fhwa.dot.gov/policyinformation/pubs/hf/pl11028/onh2011.pdf"
    name="DOT"
    title="Our Nations Highways">2011</footnote>
```

The plugin generates two things in the document.

FIRST: The `footnote` tag is replaced with a reference similar to the following, using the `ak_footnoteRef.html.ejs` partial:

```
<sup>[<a href="#DOT">DOT</a>]</sup>
```

SECOND: At the end of the document, a `<div id='footnote-area'></div>` tag is appended to hold the footnotes.  The footnote text is rendered by the `ak_footnote.html.ejs` partial.

## INSTALLATION

The `akashacms-footnotes` plugin must be registered as a plugin.

The first step is to add this plugin to the dependencies list in `package.json`.

The second step is to add it to the array of plugins given to the `akasha.registerPlugins` function.  For example, in an AkashaEPUB Gruntfile.js:

```
    config: function(akasha) {
		akasha.registerPlugins([
			{ name: 'akashacms-epub', plugin: akashaEPUB },
			{ name: 'akashacms-footnotes', plugin: require('akashacms-footnotes') }
		]);
    }
```
