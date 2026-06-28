
This directory contains Markdown files, plus template files, for a website describing and documenting AkashaCMS.  This is a software package for building static HTML projects like websites, EPUB electronic books, and PDF documents.  The features of AkashaCMS include:

* Supporting multiple template engines (EJS, Nunjucks, Mustache, etc)
* Multiple page layout templates
* Server-side DOM manipulation, allowing for:
	* Custom HTML-esque tags like `<youtube-embed>`
	* Custom HTML cleanups and processing
	* Output as HTML or XHTML (necessary for EPUB)
* Flexible configuration for document and layout sources
* A plugin system offering more flexibility
* Improved CSS using LESS-CSS

AkashaCMS supports four classes of content directories:

- _Assets_ -- Files, like CSS or images, that are not processed but simply copied to the rendering output directory
- _Partials_ -- Templates that are used inline with content that serve as reusable "snippet" where values can be passed into the template
- *Layouts* -- Templates that handle full-page layout and header meta-tags
- *Documents* -- Content which forms the body of pages on the website or e-book

The document files are written in Markdown.  Each file has a frontmatter section that's in YAML format, that is preceeded by a line containing "---", and succeeded by a line containing "---".  The important fields are:

* title - The intended title of the article
* teaser - Teaser/explanatory text that can be used in the header tags, as well as in the article presentation
* publicationDate - when the article is considered published
* tags - Is an array of "tag names" which are topical keywords.
* heroPicture - The primary image to use with the article
* blogtag - Identifies which "blog" that it will appear in.  The allowed values are "news", "nodejs", "doctor-who"

The content is processed by AkashaCMS (https://akashacms.org) into static HTML pages.  The directories containing the inputs to rendering the website are:

* `assets` - Contains files which are simply copied to the output directory - such as JavaScript or CSS files
* `partials` - Contains snippet/template files
* `layouts` - Page layout templates
* `documents` - The blog post source files

Upon rendering, all content is generated into 'out'.

AkashaCMS is a Node.js application, and therefore the `package.json` is used to drive all processes and to manage the dependencies.  The `scripts` section of `package.json` contains commands used in rendering the website, previewing the website locally, and deploying the website to the public server.

The AkashaCMS website is publicly visible at https://akashacms.com

Incomplete links appear regularly in the documents.  AkashaCMS allows such links to local documents, and in such a case it pulls in the _title_ text to use as the link text.

The files in the `documents` directory are the official documentation for AkashaCMS.  An AI system using the rules in this file can consult that documentation to better understand how AkashaCMS functions.

The configuration for this website is in the file `config.mjs`.  It is perhaps the most complex configuration of all known AkashaCMS projects.

# Creating blog posts

When I write "Create new blog post with vpath PATH-NAME"

1. Make a copy of the file templates/blog.md at the file-system path constructed by prepending "documents/" to the pathname given in PATH-NAME.  This means a PATH-NAME of linux/tools/apt.html.md would be created as documents/linux/tools/apt.html.md
2. In the file you create, update the metadata field publicationDate with the current date/time using ISO date/time format.

The template file is formatted using the document format described earlier.
