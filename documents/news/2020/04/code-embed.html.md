---
layout: blog.html.ejs
title: Embed code snippets in AkashaCMS rendered HTML documents
publicationDate: April 4, 2020
blogtag: news
teaser: |
    When presenting code snippets it is useful to have the code highlighted properly.  With the Markdown documents used in AkashaCMS it is easy to use code snippets since the Markdown language directly supports this.  But sometimes we want to include an external file and have it treated similarly.
---

We have added a new custom tag to AkashaCMS - `<code-embed>`.  This reads in a file from the document directory, and includes it inside the rendered HTML.  

It is quite simple to use.  If your document directory has a file, say `foo.css`, you might include it as text using:

```
<code-embed lang='css' file-name='code/foo.css'></code-embed>
```

The `file-name` attribute can be either a relative file name, or an absolute file name.  For relative file names, the actual path of the file is computed relative to the document.  For absolute file names, it is computed relative to the document directory, or document directories.

The `lang` attribute describes which programming language to use.

It also supports an `id` attribute if you need this for CSS markup.

This is what it looks like:

<code-embed lang='css' file-name='code/foo.css'></code-embed>

The result of this is an HTML structure like:

```html
<pre id='id'>
<code class='lang'>
... CONTENTS OF FILE
</code>
</pre>
```

This HTML structure was chosen for the purpose of using the Highlight.js library.  That library does in-browser Highlighting of text based on the programming language.  The result is an increase in usefulness of code snippets on AkashaCMS websites.

The `code-embed` tag is part of the AkashaRender `built-in` plugin, meaning it will be available in every AkashaCMS project.

