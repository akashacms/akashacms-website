---
layout: blog.html.ejs
title: Announcing 0.7 release of AkashaRender and Mahabhuta
publicationDate: July 17, 2019
blogtag: news
teaser: |
    A major change was made to the AkashaRender and Mahabhuta API's back in March/April.  I had held back on publishing an update to these modules but they've been in use long enough to prove their stability.  The changes improve configuration files, and make it easier to reuse MahabhutaArray's outside of an AkashaRender project.
---

The move from 0.6 to 0.7 took about 2 years.  That's not quite right, but is a reflection that my primary focus is on using AkashaCMS to build my websites rather than to develop AkashaCMS as a product.  

# Changes in AkashaRender

## Implemented AsciiDoc support

AkashaCMS was originally designed around rendering Markdown documents to web pages.  But I learned that AsciiDoc is a very powerful alternate to Markdown.  To use an AsciiDoctor document simply name it with an extension `.html.adoc` and AkashaRender will render it to HTML.

## Parallelized rendering

While exploring why some of my websites rendered so slowly, it dawned on me that AkashaRender did not make use of parallel processing.  The Node.js platform has excellent support for event driven parallelism.  In a web service context that means Node.js supports multiple concurrent requests from client programs, and interleaves processing those requests.

For a CLI program like AkashaRender - it didn't occur to me this would help.  But I rewrote the `render` function to process documents in parallel.  Rather than simply throwing the array of documents into `Promise.all`, I used the `parallelLimit` module to have a controlled amount of parallelism.

After testing running `n` renders in parallel, it seemed the sweet spot was processing about 7 or 8 documents at a time.

The concurrency level is set in `config.js` with the `setConcurrency` function.  It defaults to a concurrency of `3`.

## Improved report at end of rendering a website

In the past the report of files rendered was disorganized, with the steps for the rendering of each file being reported semi-randomly.

The new output format reports each rendering stage for a file immediately after the previous stage of that file.  It lets us directly see how long it took to render a given file, and what steps were involved.

```
.html.md /home/docker/jenkins/workspace/greentransportation.info/ev-charging/range-confidence/chap4-charging/4-charging-levels.html.md ==> /home/docker/jenkins/workspace/greentransportation.info/out/ev-charging/range-confidence/chap4-charging/4-charging-levels.html (0.336 seconds)
/home/docker/jenkins/workspace/greentransportation.info/ev-charging range-confidence/chap4-charging/4-charging-levels.html.md /home/docker/jenkins/workspace/greentransportation.info/out/ev-charging FRONTMATTER 0 seconds
/home/docker/jenkins/workspace/greentransportation.info/ev-charging range-confidence/chap4-charging/4-charging-levels.html.md /home/docker/jenkins/workspace/greentransportation.info/out/ev-charging FIRST RENDER 0.002 seconds
/home/docker/jenkins/workspace/greentransportation.info/ev-charging range-confidence/chap4-charging/4-charging-levels.html.md /home/docker/jenkins/workspace/greentransportation.info/out/ev-charging FIRST MAHABHUTA 0.036 seconds
/home/docker/jenkins/workspace/greentransportation.info/ev-charging range-confidence/chap4-charging/4-charging-levels.html.md /home/docker/jenkins/workspace/greentransportation.info/out/ev-charging SECOND RENDER 0.335 seconds
/home/docker/jenkins/workspace/greentransportation.info/ev-charging range-confidence/chap4-charging/4-charging-levels.html.md /home/docker/jenkins/workspace/greentransportation.info/out/ev-charging RENDERED 0.336 seconds
```

## Clean up `config.js` - Allow Plugin constructor to take options object

This may seem like a small thing, but it has the potential to hugely clean up `config.js` files.

In the past configuring a Plugin meant a construct like this:

```js
config.use(require('akashacms-base'));

config.plugin("akashacms-base").generateSitemap(config, true);

config.plugin("akashacms-external-links")
    .setTargetBlank(config, true)
    .setShowFavicons(config, "before");
```

And then inside the Plugin, the configuration data is not stored in the Plugin instance but instead in the Configuration.  Like:

```js
config.pluginData(pluginName).linkRelTags.push(lrTag);
```

On reflection this seemed backwards.  The new API now supports this model instead:

```js
config.use(require('akashacms-dlassets'), {
        cachedir: path.join(__dirname, 'dlassets-cache')
    });
```

That is the `use` method now takes an optional second argument containing an options object.  The options object is defined by the Plugin, and will be documented by the Plugin.

The second change is that the options data is stored in a Plugin field named `options`.  That means the Plugin implementation does not need to retrieve `config.pluginData` but can manipulate its options on its own.

# Changes in Mahabhuta

## Support using a MahafuncArray in both AkashaRender and other 3rd party software

The following API is suggested for modules that define MahafuncArray's.  This API is meant to support using the MahafuncArray not just in AkashaRender, but in other software.

```js
module.exports.process = async function(text, metadata, options) {
    let funcs = module.exports.mahabhutaArray(options);
    return await mahabhuta.processAsync(text, metadata, funcs);
};

module.exports.mahabhutaArray = function(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(...);
    ... add other Mahafunc objects
    return ret;
};
```

The MahafuncArray object can be initialized with an `options` object (see the next section).  

The `process` function is designed to take HTML text, construct the MahafuncArray, process the HTML using that array, and then return the processed HTML.

## MahafuncArray options 

Like for Plugin's, the MahafuncArray object can be initialized with an options object.

Each Mahafunc receives a reference to the MahafuncArray it has been added to.

This gives us an organized method to configure the Mahafunc's in a MahafuncArray.  Presumably such Mahafunc's are related to each other, and therefore we can tailor their action through one options object.

Since this probably seems obtuse, let's walk through a concrete example.

In the `akashacms-external-links` plugin the `configure` method reads as follows:

```js
configure(config, options) {
    config.addAssetsDir(path.join(__dirname, 'assets'));
    this[_plugin_options] = options;
    config.addMahabhuta(elp_funcs.mahabhutaArray(this[_plugin_options]));
    return this;
}
```

The new `options` argument coming from `config.js` is stored in the Plugin object.  The result is:

* In the `config` file we specify an options object.
* That options object is passed into the Plugin for its use.
* That options object is passed into the MahafuncArray for its use.
* Each Mahafunc in the MahafuncArray has easy access to that options object.

For example a Mahafunc can now do this:

```js
this.array.options.preferNofollow
```

The options are now this easy to access.  

In the past the Mahafunc had to jump through a hoop:

```js
metadata.config.pluginData(pluginName).linkRelTags
```

This meant we overloaded the `metadata` object to contain other data such as a reference to the `config` object.  That still didn't give us the Plugin object, and we had to look up the `pluginData` for the Plugin.

The new method is much cleaner.
