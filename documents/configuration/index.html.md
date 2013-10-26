---
title: Configuring an AkashaCMS website
layout: index-page.html.ejs
---

AkashaCMS is configured by implementing a small module (named `config.js`) that simply returns a JavaScript object.  That is, the configuration file is just a Node.js module, but instead of providing functions it provides an object containing configuration data.

This turns out to be very flexible, and configuration data can be shared between multiple tools.  Because the config file is a module, it can contain local functions or require other modules.
