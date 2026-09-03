---
layout: how-to.html.njk
title: Publishing an AkashaCMS website to GitHub Pages
rightsidebar:
author: david
publicationDate: August 23, 2026
---

GitHub Pages is a free website hosting service that can be attached to any GitHub repository.

A repository owner may want to publish a website describing whatever is housed in that repository.  A typical case is an open source software project using GitHub for project hosting and management.  The project maintainers are able to use GitHub pages to house project documentation, announcements, or anything else that one could do with a website.

GitHub pages does not support dynamic page generation, and instead supports static HTML websites.  While the GitHub pages documentation solely describes using Jekyll to publish websites, it supports any other static HTML website generator.

AkashaCMS has built-in support for publishing websites to GitHub Pages.

## Examples of AkashaCMS websites published to GitHub Pages

Each of these examples include working code that publish a website to GitHub pages using AkashaCMS tools.

[PDF Document Maker](https://akashacms.github.io/pdf-document-construction-set/) is an example of an open source project that uses GitHub pages to host its documentation and announcements website.  The website source code is within the project repository at https://github.com/akashacms/pdf-document-construction-set/tree/main/guide

The [EV Charging Use Specification Code](https://github.com/clean-energy-tools/ev-charging-use-specification-code) is a small project to publish JSON Schema files related to the _EV Charging Use Specification_, which is a data format for reporting electric vehicle charging station information for upstream partners.

The AkashaCMS project includes an example skeleton site for a fictitious open source software project that uses GitHub Pages for its website:  https://github.com/akashacms/open-source-site  (This example hasn't been updated for awhile)

The [AkashaCMS GitHub Skeleton](https://github.com/akashacms/skeleton-github) is a skelatal example of publishing an AkashaCMS website to GitHub.  (This example hasn't been updated for awhile)

## Configuring a GitHub repository for GitHub Pages

While logged-in to GitHub, navigate to your repository, and click on the _Settings_ button.

On the left navigation bar, scroll down to _Pages_ and click on it.

This settings page is where you configure the details of publishing the website. 

Start with selecting _Deploy from a branch_ in the _Source_ dropdown.

For the _Branch_ configuration there are two configurations in use by AkashaCMS projects:

1. Select the _master_ (or _main_) branch, and select a directory like `/docs`.
2. Select the _gh-pages_ branch, and select the directory `/`.

The combination of _branch_ plus _directory_ determines where your AkashaCMS rendering directory will be located.

It's possible to configure a custom domain.  By default, the URL will be in this pattern: https://akashacms.github.io/pdf-document-construction-set/ -- which is _`ORGANIZATION.github.io/REPOSITORY-NAME`_

## Configuring an AkashaCMS project for publishing to GitHub Pages

AkashaCMS projects produce a directory, the rendering output directory, which contains the HTML for your website.

As we said above, the _Branch_ configuration must match the location of your rendering output directory.  Normally in an AkashaCMS project, the rendering output directory would not be pushed to a Git repository.  But, to publish that directory to GitHub Pages requires storing the rendering output directory in the Git repository.

For the case where rendering output is on the _main_ (or _master_) branch, then the rendering output directory must be in a subdirectory.  By contrast, when the output is in the _gh-pages_ (or other) branch, it can be in the root directory.

Remember that the default rendering output directory is `out`.  To change this to a different directory, such as `docs`, put this in the configuration (`config.mjs`):

```js
config.setRenderDestination('docs');
```

## The process for publishing to GitHub Pages with AkashaCMS

Then, in `package.json` add this script (if publishing from a branch other than _main_ or _master_):

```json
{
    "scripts": {
        "build": "npx akasharender render config.mjs --copy-assets",
        "gh-pages": "npx akasharender gh-pages-publish config.mjs"
    }
}
```

Or, if it is publishing from the _main_ or _master_ branch

```json
{
    "scripts": {
        "prebuild": "rm -rf docs/* && mkdir -p docs",
        "build": "npx akasharender render config.mjs --copy-assets",
        "commit": "git add docs && git commit -m 'Update Generated Site' docs"
    }
}
```

What this does is, for a normal AkashaCMS project, that renders its content to a given directory (either `out` or whatever is configured), to send that content to GitHub Pages.

1. Use `gh-pages-publish` to publish from a branch other than _main_ or _master_
2. Use `commit` to publish from the _main_ or _master_ branch

By default the `gh-pages-publish` command publishes from the `gh-pages` branch.  The `--branch` option can be used to select a different branch name.

```shell
$ npx akasharender gh-pages-publish --help
Usage: akasharender gh-pages-publish [options] <configFN>

Publish a site using Github Pages.  Takes the rendering destination, adds it into a branch, and pushes that to Github

Options:
  -b, --branch <branchName>  The branch to use for publishing to Github
  -r, --repo <repoURL>       The repository URL to use if it must differ from the URL of the local directory
  --remote <remoteName>      The Git remote name to use if it must differ from "origin"
  --tag <tag>                Any tag to add when pushing to Github
  --message <message>        Any Git commit message
  --username <username>      Github user name to use
  --email <email>            Github user email to use
  --nopush                   Do not push to Github, only commit
  --cname <domain>           Write out a CNAME file with the domain name
  -h, --help                 display help for command
```

## What about other Git services?

The other Git services have a Pages feature.

The `akasharender gh-pages-publish` command works with GitHub Pages, and not any of the others.

We have not studied how to do this with other services.
