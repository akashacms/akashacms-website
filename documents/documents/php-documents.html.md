---
layout: article.html.ejs
title: PHP Files in AkashaCMS 
rightsidebar:
publicationDate: Feb 12, 2015
author: david
---

It's useful to have PHP files in an AkashaCMS site, even though the purpose of AkashaCMS is static-HTML websites.  PHP is a widely used tool for websites, and is frequently available on the low-end web hosting we target with AkashaCMS.  Hence, it's a way of adding some dynamic content to a site that is otherwise completely static.

PHP files don't get to be a full player in the AkashaCMS ecosystem, however.  There are exactly two methods to use PHP scripts on a site which work.

## Simple .php -- no processing by AkashaCMS

You can simply put a `.php` file in either the `root_assets` or `root_documents` directories.  AkashaCMS will simply copy that file to the `root_out` directory with no processing.  There's no opportunity in this case to incorporate any data from other files on the site, or otherwise use AkashaCMS facilities.

## Process .php with EJS -- minimal integration with AkashaCMS

If you want some degree of processing by AkashaCMS, use the `.php.ejs` file extension.  As implied by the file name, this is processed by EJS before being written to `root_out` with the `.php` file extension.

Mahabhuta processing does not occur in this case, meaning you cannot use any of the special tags that are available.

Because it is EJS, you can only use synchronous functions.  Functions with asynchronous behavior simply don't work in EJS.

For example:

```
<%= partial('some-partial.html.ejs', locals) %>
<%= partial('some-partial.html.ejs', {
    data: "value", data2: "value2"
}) %>
```

Both these will work to synchronously access and render an EJS partial.

Plugins can also export functions you can access this way (so long as they execute synchronously):

```
<%= plugin('plugin-name').functionSync(args) %>
```

### Why no Mahabhuta?

It's been determined that when PHP code is processed by Mahabhuta it encodes some of the PHP tags into HTML entities.