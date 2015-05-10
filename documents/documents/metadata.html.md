---
layout: article.html.ejs
title: Document metadata in AkashaCMS 
rightsidebar:
publicationDate: May 9, 2015
author: david
---
The frontmatter on each file serves the role of metadata.  Primarily the frontmatter tags and content are to be used by templates.  The data is also available via the API for consumption by a plugin.

For example you can do this:

```
var entry = akasha.readDocumentEntry(config.root_docs, fileName);
```

And then ```entry.frontmatter``` contains everything about the document.  A YAML object ```entry.frontmatter.yaml``` contains the frontmatter parsed into an object.