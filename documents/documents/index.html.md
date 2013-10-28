---
layout: index-page.html.ejs
title: AkashaCMS documents
rightsidebar:
---

The `root_docs` array in the configuration is a list of directories that contain content files.  Content files are examined and processed to render them into the output directory.  This differs from the files in the directories listed in the `root_assets` array, which are simply copied unprocessed to the output directory.

Content files in AkashaCMS follow a fairly simple format that serves two purposes

* Metadata that can be used by code in templates, and declares the page layout to use
* Content that's made available in the `content` variable
