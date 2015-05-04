---
layout: article.html.ejs
title: Customized rendering chains -- fileName.html.xyz.abc.ksk
rightsidebar:
publicationDate: May 4, 2015
---

In [](extensions.html) we discussed the file name format and rendering chains supported by default.  That is a file named `foo.html.md` is processed by Markdown, and then written to `root_out` as `foo.html`.  This is very straightforward, but sometimes we want more flexibility to support any kind of rendering algorithm.

AkashaCMS supports what we're calling a pluggable rendering chain with with a simple JavaScript object with functions implementing a given rendering algorithm.  The same object is used for the built-in rendering chains.

* [lib/md.js](https://github.com/akashacms/akashacms/blob/master/lib/md.js) -- Implements `foo.html.md`
* [lib/renderer-cssless.js](https://github.com/akashacms/akashacms/blob/master/lib/renderer-cssless.js) -- Implements `foo.css.less`
* [lib/renderer-ejs.js](https://github.com/akashacms/akashacms/blob/master/lib/renderer-ejs.js) -- Implements `foo.html.ejs` and `foo.html.ejs.md`

## Implementation

The rendering chain object is as so:

```
var renderingChain = {
  match: function(fname) {
	var matches;
	if ((matches = fname.match(/^(.*\.ext1)(\.ext2)$/)) !== null) {
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
    return render_the_text_synchronously(text, metadata);
  },
  render: function(txt, metadata, done) {
    render_the_text_asynchronously(txt, function (err, rendered) {
        if (err) done(err);
        else     done(null, rendered);
    });
  }
};
```

The renderChain object has three functions,

* `match` to indicate whether this renderChain handles a given file name
* `renderSync` to render text in a synchronous fashion
* `render` to render text in asynchronous fashion

The rendering chain implementation needs to take the input text all the way to its final rendering.  For example, the implementation of the `foo.html.ejs.md` rendering chain includes this function:

```
renderSync: function(text, metadata) {
    return ejs.render(md.renderSync(text), metadata);
},
```

The `match` function serves two functions:

* Telling the Renderer that this rendering chain matches the file that's being rendered 
* What file name into which to write the final rendering 

The latter is done through the magic of regular expressions.  Your regex has to match the final file name, and provide the file extension beyond the final file name, as shown here.

The `match` function returns an object, as shown above, documenting the full path name, what it needs to render as, and the matching extension.  This is needed by other pieces of AkashaCMS to determine what file name to create after processing the file.

The `render` and `renderSync` methods handle content rendering in cases constrained by synchronous code execution, or in cases allowing asynchronous code execution.  If the given rendering algorithm doesn't support one or the other, simply make the appropriate function null.

It's sometimes useful to make each rendering chain a standalone module:

```
module.exports = {
  match: ...,
  renderSync: ...,
  render: ...
};
```

## Registering a Rendering chain

One informs AkashaCMS of a rendering chain with the `registerRenderChain` method:

An example is:

```
var renderingChain1 = require('./lib/renderingChain1');
var renderingChain2 = require('./lib/renderingChain2');
var renderingChain3 = require('./lib/renderingChain3');
var renderingChain4 = require('./lib/renderingChain4');

    ...
    [ renderingChain1, renderingChain2, renderingChain3, renderingChain4 ].forEach(function(renderer) {
		akashacms.registerRenderChain(renderer);
	});
	...
```

Or

```
akashacms.registerRenderChain({
    match: ...,
    renderSync: ...,
    render: ...
});
```



