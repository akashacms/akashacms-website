---
layout: index-page.html.ejs
title: AkashaCMS documents
rightsidebar:
author: david
publicationDate: Jan 1, 2015
---
It's meant that documents in an AkashaCMS site be simple and easy to edit, and to focus the content author on the content.  All the layouts, partials and plugins discussed elsewhere provide the infrastructure within which the content sits.  But the goal is that Documents contain just the core content of the given page.

The `root_docs` array in the configuration is a list of directories that contain content files.  Content files are examined and processed to render them into the output directory.  This differs from the files in the directories listed in the `root_assets` array, which are simply copied unprocessed to the output directory.

Content files in AkashaCMS follow a fairly simple format that serves two purposes

* Metadata that can be used by code in templates, and declares the page layout to use.  Metadata is written as YAML code.
* Content that's made available in the `content` variable.  We prefer to use the Markdown format, but content can be written in HTML if you prefer.