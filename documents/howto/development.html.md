---
layout: how-to.html.njk
title: Setting up a development environment for AkashaCMS
rightsidebar:
publicationDate: August 15, 2026
---

AkashaCMS runs on Node.js for v24 and later.  All code is available in repositories at https://github.com/akashacms.

Most users will be happy using AkashaCMS packages without modifying them or developing new packages.  This page is for the other people, who want more.

You might be interested in fixing bugs, adding features, or developing plugins. All those tasks require setting up a development environment.

First, you must be knowledgeable with Node.js, server-side JavaScript, DOM processing using jQuery, HTML, CSS, TypeScript, SQL, and some other technologies that aren't coming to mind.  Or, you must be willing to use an AI system that knows all those things.

## Tools setup

You will need to install Node.js on your computer, and have a coding IDE.  For this I prefer to use:

* https://nvm.sh -- For managing Node.js versions
* https://vscodium.com/ -- For a coding IDE.  This is Visual Studio Code but stripped of the Microsoftisms.

You'll also need developer CLI tools like Git installed.  I don't know precisely what's required since I always install all those tools anyway.  As a Node.js project, these needs are minimal in most cases.  None of the AkashaCMS packages rely on native code packages, for example.

## Cloning repositories

The AkashaCMS ecosystem is made of several repositories, which are the core tools plus the (known) plugins.

Cloning best practice:

```shell
git clone git@github.com:akashacms/REPOSITORY-NAME.git
cd REPOSITORY-NAME
git remote add upstream https://github.com/akashacms/akashacms.git
git fetch upstream
```

Make sure your user name etc is configured:

```shell
git config user.name "J. Random User"
git config user.email "j.random.user@example.com"
```

It works best if these are cloned to the same directory.

Once the repositories are siblings of each other your development practice can be to cross-reference the packages with a `../DIRECTORY/...` pathname reference.

**Core tools**:

* https://github.com/akashacms/akasharender -- Akasharender - the core of the AkashaCMS ecosystem
* https://github.com/akashacms/rendering-engines -- Integrates several template rendering systems
* https://github.com/akashacms/mahabhuta -- jQuery-like DOM processing for custom HTML elements, and much more
* https://github.com/akashacms/akashacms-perftest -- Performance testing of AkashaCMS

**Plugins**:

* https://github.com/akashacms/akashacms-adblock-checker -- Check whether the visitor is blocking advertisements, and display a warning
* https://github.com/akashacms/akashacms-affiliates -- Integrate with several popular affiliate marketing programs
* https://github.com/akashacms/akashacms-plugin-authors -- Display an authorship block on an AkashaCMS web page
* https://github.com/akashacms/akashacms-base -- Base capabilities for building websites
* https://github.com/akashacms/akashacms-blog-podcast -- Publish a blog on an AkashaCMS website
* https://github.com/akashacms/akashacms-booknav -- Book-like navigation of a group of pages on an AkashaCMS website
* https://github.com/akashacms/bootstrap-icons -- The icon library published by the Bootstrap project
* https://github.com/akashacms/akashacms-breadcrumbs -- Generates a trail of the parent directories for a given page
* https://github.com/akashacms/akashacms-dlassets -- Autodownload of "assets" (images etc) referenced from 3rd party websites
* https://github.com/akashacms/akashacms-document-viewers -- Viewer code for displaying documents on an AkashaCMS web page
* https://github.com/akashacms/akashacms-embeddables -- Embedding content from other websites, like YouTube
* https://github.com/akashacms/country-flag-icons -- Icon library with flags of all countries
* https://github.com/akashacms/akashacms-footnotes -- Add footnotes to AkashaCMS documents
* https://github.com/akashacms/plugins-diagrams -- Allow integrating diagrams from several diagramming platforms
* https://github.com/akashacms/mermaid-wasm-renderer -- Helper for rendering Mermaid diagrams
* https://github.com/akashacms/akashacms-external-links -- Improves the looks and usefulness of outbound links
* https://github.com/akashacms/akashacms-theme-bootstrap -- Theming for Bootstrap v5.x
* https://github.com/akashacms/tabler-icons -- The `@tabler` icon library
* https://github.com/akashacms/akashacms-tagged-content -- Building tag-based navigation pages for an AkashaCMS website


**Documentation**:

* https://github.com/akashacms/akashacms-website -- The main documentation website for https://akashacms.com
* https://github.com/akashacms/akashacms-example -- Serves as a tool to publish examples of using AkashaCMS features, plus a means of testing the system
* https://github.com/akashacms/open-source-site -- Demonstrates building an open source software project with AkashaCMS
* https://github.com/akashacms/akashacms-skeleton -- A minimal AkashaCMS website meant to serve as a starting point
* https://github.com/akashacms/skeleton-github -- Simple website demonstrating deployment to the GitHub Pages service

**PDF Generation**:

* https://github.com/akashacms/pdf-document-construction-set -- PDF Document Maker is a comprehensive tool for building PDF documents from AkashaCMS documents

**EPUB Generation**:

* https://github.com/akashacms/akasharender-epub -- Configures AkashaCMS to build EPUBs
* https://github.com/akashacms/epubtools -- CLI for building EPUB documents
* https://github.com/akashacms/epub-guide -- Documentation for EPUB generation using AkashaCMS
* https://github.com/akashacms/epub-website -- Integrate the content of an EPUB into a website

## Branching

Before starting a project - whether it's fixing a bug or developing a new feature - you must create a new branch:

```shell
$ git checkout -b new-branch-name -t upstream/HEAD
```

## Make tests

Most of the AkashaCMS repositories have a test suite in the `test` directory.

For most, we have converted to using the `node:test` framework, but a few will still use the Mocha framework with Chai assertions.

For fixing a bug, make sure to create tests that replicate the bug.  This will help you know that you've fixed the bug, and well help us in the future to avoid recreating the bug.

For a new feature, create multiple tests for each way to use the feature.

## Make a complete pull request

Include not just code, but documentation and tests.

Almost every AkashaCMS-related repository includes documentation.

## AI Usage

Are we all worried about the direction software development is taking due to AI?

Make sure to use AI wisely.  Please do not submit AI Slop to the AkashaCMS project.

Using AI wisely, when developing a new feature, means to start by building a comprehensive specification for the feature.  AI tends to do much better with good specifications.

The `akasharender` repository contains an LLM Wiki with concept pages, answer pages, architecture pages, and implementation pages.  It's believed these documents help the AI system to better understand the AkashaCMS architecture.

It means you can position your AI agent (OpenCode, Pi, Codex, etc) in the `akasharender` repository, and work on any of the plugins.  In `akasharender/AGENTS.md` is a list of the related repositories, so your instructions to the AI system can reference repositories by name, and the AI system knows the directory.  It also means the AI system has access to the existing base of architecture and implementation documents, from which the AI system draws code creation guidance.

```shell
cd akasharender
opencode
```

A recent example prompt:

> Implement self-hosted favicon discovery in `@akashacms/plugins-external-links` to replace the Google Favicon service. The design:
>   ... explain how it should work

Simply by naming the the plugin, the AI system knew the directory for that plugin.  While the AI coding agent was located in the `akasharender` directory, it reached into the sibling directory to do all the work.

