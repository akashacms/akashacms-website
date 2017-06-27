---
layout: blog.html.ejs
title: Announcing AkashaCMS 0.4.1 - rendering chains, grunt integration, EPUB generation, and more
publicationDate: Feb 25, 2015 12:07 PDT
blogtag: news
teaser: Major amount of work went on the last two weeks, restructuring AkashaCMS to allow pluggable rendering chains, using it in a Grunt workflow, and generate EPUB files.
---

The last two weeks I've learned how to create EPUB 3 documents, and have adapted AkashaCMS to do so.  Along the way some major restructuring of AkashaCMS were necessary to create EPUB 3 documents.  A new plugin, [AkashaEPUB](https://github.com/akashacms/akashacms-epub), is the result.  This brought in some much-wanted capabilities that had been on the issue queue for a long time.

## Pluggable renderingChain's

Out of the box AkashaCMS supports a [couple file extensions (example.html.md, etc)](/akasharender/3-create-content.html).  While that was pretty good, there are a lot more potential file types we might want to create using AkashaCMS.  Such as the special files used in EPUB documents.  A generic file processing mechanism was needed.  In the 0.3.x timeframe I tried to implement such a thing, but it became too convoluted and I gave up.  As of 0.4.0 the rendering module supported just a few rendering chains.

A _renderingChain_ is a sequence of rendering steps.  For example, AkashaCMS core supports `example.html.ejs.md` which says to render the content first with Markdown, then with EJS, and produce an HTML file named `example.html`.

The code to implement that renderingChain is [in the repository](https://github.com/akashacms/akashacms/blob/master/lib/renderer-ejs.js) and looks like this:

```

module.exports.rendererEJSMD = {
  match: function(fname) {
	var matches;
	if ((matches = fname.match(/^(.*\.html)(\.ejs\.md)$/)) !== null) {
	  return {
		path: matches[0],
		renderedFileName: matches[1],
		extension: matches[2]
	  };
	} else {
	  return null;
	}
  },
  renderSync: function(text, metadata) {
	return ejs.render(md.renderSync(text), metadata);
  },
  render: function(text, metadata, done) {
	done(null, ejs.render(md.renderSync(text), metadata));
  }
};
```

It's just an object with three methods.  You can, if desired, implement a renderingChain as a module as is done for the [HTML rendering chain](https://github.com/akashacms/akashacms/blob/master/lib/renderer-html.js), which just copies the input to the output with no modification.

The functions are:

* `match`: Function to match a filename to see if this renderingChain is to be used.  As you see an object with three elements are returned.  The full path (`path`), the file name to render this to (`renderedFileName`) and the portion of the extension which indicated the rendering chain.
* `renderSync`: Function to render the content in a synchronous fashion.
* `render`: Function to render the content in an asynchronous fasion.

You inform AkashaCMS about a renderingChain with the `akasha.registerRenderChain` function.

```
...
var rendererCSSLess = require('./lib/renderer-cssless');
...
akasha.registerRenderChain(rendererCSSLess);
...
```

In practice it is now quite easy to develop a custom renderingChain module, plug it into AkashaCMS, and start rendering a new kind of file.  [AkashaEPUB](https://github.com/akashacms/akashacms-epub) has several renderingChain's

## First integration with Grunt

Grunt (and Gulp) are two major results of the Node.js platform's existence, and are widely used in building not just Node.js projects but other sorts of things.  I'd long been interested in the potential that might come from integrating AkashaCMS with either, or both.

For example there's a whole slew of minifying tools.  Rather than build a minifier into AkashaCMS, just minify the `root_out` directory after building it.

While creating the AkashaEPUB module, I decided to use that as an excuse for Grunt integration.  Turned out to be real easy.  By no means is the integration finished, but there are a few Tasks now exported by AkashaCMS.  Grunt is the only way to build an EPUB using AkashaEPUB.

The idea is that, when fully implemented, you'll be able to write a Gruntfile.js containing commands like this:

```
grunt.loadNpmTasks('akashacms');
grunt.loadNpmTasks('akashacms-epub');
```

And then use the Gruntfile to drive the process of building your site.  At that point I might retire the `akashacms` command.

For a working example, look at the Gruntfile in the [AkashaEPUB Guide](https://github.com/akashacms/epub-guide).

## AkashaEPUB

It's almost not worth mentioning this, since I've already given the requisite links above.

AkashaEPUB is an AkashaCMS plugin which adds the capability to generate EPUB 3 files.

At the moment the plugin generates `.epub` files, that conform to the EPUB 3 spec, and that pass the `epubcheck` program.  The documentation is incomplete, and is in the AkashaEPUB Guide.  The source code for the guide is itself documentation on how to use the plugin.
