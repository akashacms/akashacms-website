---
layout: getting-started.html.njk
title: Getting started with AkashaCMS
rightsidebar:
author: david
publicationDate: February 18, 2021
---

AkashaCMS is a family of tools for converting ideas into websites or EPUB3 eBooks while maintaining separation between content, layout and design.  At the core is AkashaRender, the rendering engine, and Mahabhuta, a semi-independent module for server-side DOM processing using a jQuery-like API.

An _AkashaCMS Project_ is comprises an AkashaCMS Configuration object, any required AkashaCMS plugins, and files related to the project.  The configuration object is usually initialized in a JavaScript file named `config.js`.  The types of files include _assets_, the static files that are simply copied into the project output, _layouts_ and _partials_, two kinds of templates, and _documents_, or the content files.  The purpose is to convert these files into an HTML or XHTML rendered output which may be a website, or an EPUB e-Book.

Since AkashaCMS is a Node.js based tool, the most natural way to manage an AkashaCMS project is using Node.js tools.  This means using a `package.json` file to list dependencies on other Node.js modules, and to record a set of scripts with which to build and deploy the project.
