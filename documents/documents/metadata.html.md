---
layout: article.html.ejs
title: Document metadata in AkashaCMS 
rightsidebar:
publDate: Nov 4, 2013
---

The frontmatter on each file serves the role of metadata.  Primarily the frontmatter tags and content are to be used by templates.  The data is also available via the API for consumption by a plugin.

For example you can do this:

```
var entry = akasha.getFileEntry(config.root_docs, fileName);
```

And then ```entry.frontmatter``` is an array where ```entry.frontmatter[tagname]``` contains the tag value.