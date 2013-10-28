---
layout: article.html.ejs
title: Template Functions
rightsidebar:
---

The EJS (`.html.ejs`) and Kernel (`.html.kernel`) template engines both support providing functions that can be invoked from a template.  As we saw in the [configuration file](/configuration/aa-format.html), those functions are in the `config.funcs` object.  See the [file names and extensions documentation](/documents/extensions.html) for the list of supported engines, and links to the documentation for each.

In EJS you call template functions one of two ways:

    <%= function(arguments) %>

This encodes the output such that HTML codes gets encoded to be displayed as the code.  What's more common is to instead incorporate the output of the function directly in the output, unencoded, which you do this way:

    <%- function(arguments) %>

In the Kernel template engine, functions are invoked as so:

    {function(arguments)}

# Built-in template functions

## Partials

[Partial's](partials.html) are snippets of templates that can be inserted anywhere.  While AkashaCMS provides an API to render partial's, it also provides a template function to do so.

The template function is executed as so:

    <%- partial('partial-file-name', params) %>     // EJS
    {partial('partial-file-name', params)}          // Kernel

The `partial-file-name` will have an extension of `.html.ejs` or `.html.kernel` for partials which can render data, or `.html.md` to use Markdown for rendering, or just `.html` for a pure HTML partial.

## OEmbed

The [OEmbed protocol](http://oembed.com/) allows us to query websites to get embed codes.  The typical example is getting the embed code for a YouTube video just by providing the URL of the video's page.

Because OEmbed requires asynchronous execution, the template function is only available in the Kernel template.

It is used as so:

    {oembed({
        template: 'partial-file-name',
        url: 'a URL to query for'
    })}

An example of using `oembed` is the `youtubePlayer` function in [the `akashacms-embeddables` plugin](/plugins/embeddables.html).  The [youtube-embed.html.ejs](https://github.com/robogeek/akashacms-embeddables/blob/master/partials/youtube-embed.html.ejs) partial is an example of rendering data retrieved with oEmbed.