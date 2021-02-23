---
layout: getting-started.html.njk
title: Project configuration
rightsidebar:
author: david
publicationDate: February 21, 2021
---

In this section let's discuss the Configuration object, and the typical method for creating one via a `config.js` JavaScript file.  We've shown several Configuration snippets, but not a complete file.

Most of the AkashaRender commands take a file name for the configuration as a command argument.  For example, the `package.json` for the project can include these `script` tags:

```
"scripts": {
    "prebuild": "akasharender copy-assets config.js",
    "build": "akasharender render config.js",
    ...
}
```

Notice that the configuration file name is there, and if you leave it out on the command line you'll get an error.

The file name `config.js` is not required, it can be any file name you like.  You may even have multiple configuration files for the same project.

Here's a simple configuration file:

```js
const akasha  = require('akasharender');

const config = new akasha.Configuration();

config.rootURL("http://example.com");

config.configDir = __dirname;

config
    .addAssetsDir('assets')
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addPartialsDir('partials');

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

config.prepare();

module.exports = config;
```

This starts by loading the `akasharender` package, and then we create a new instance of the `Configuration` class.  At the bottom we call `config.prepare`, a method that fills in any missing data and otherwise prepares the Configuration object for use.  The last line exports the `config` object via `module.exports`, so that the AkashaCMS code can access the object.

The `rootURL` function tells AkashaCMS the base URL for the website that will be generated.  It uses this value where appropriate.

The `configDir` value tells AkashaCMS the directory where the project lives.  This allows the system to compute file paths relative to the project directory.

Calling the `addAssetsDir` and other functions are not technically required.  The `prepare` method will look for those exact directory names, and if they haven't been added already, and they do exist, they will be added to the configuration.

The `setMahabhutaConfig` function is where we customize Mahabhuta.  The settings here are actually for the Cheerio library which is how Mahabhuta provides its jQuery-like API.
