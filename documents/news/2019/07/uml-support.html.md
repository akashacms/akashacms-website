---
layout: blog.html.njk
title: How to display UML diagrams inline on an AkashaCMS website
publicationDate: July 19, 2019
blogtag: news
teaser: |
    UML diagrams are widely used in software engineering, and I'm working on an AkashaCMS project that's meant to be used for software documentation websites.  While looking around I found a Markdown-it plugin to support rendering UML diagrams after placing a small UML descriptor in the Markdown file.  It's easy to use, and better yet easy to integrate with an AkashaCMS website.
---

The Markdown-it project is an extensible Markdown processor, that supports a "plugin" concept.  There's a long list of plugins available one of which supports the PlantUML library.

Since PlantUML is implemented in Java it is difficult to use it directly in a Node.js project.  What the `markdown-it-plantuml` project did was to utilize the PlantUML server to generate UML images.  What that means is - PlantUML can be used either as a command-line program, or as a server.  The PlantUML project hosts a server on their website making it available for anyone to use.  Obviously the `markdown-it-plantuml` project felt it would be easier to use the public server, rather than to run the command-line tool from Node.js code.

To add a plugin to the Markdown-it processor one simply calls the `use` method documented on the Markdown-it website.  

The Markdown renderer for AkashaCMS makes it possible to call that method.  To see how, let's walk through setting up the `markdown-it-plantuml` plugin.  Other plugins will be configured in a similar way.

The first step is to install the `markdown-it-plantuml` plugin in your project:

```
$ npm install markdown-it-plantuml --save
```

Then in the `config.js` for your AkashaCMS project add this:

```js

config.findRendererName('.html.md')
    .use(require('markdown-it-plantuml'), {
        imageFormat: 'svg'
    });
```

With `config.findRendererName('.html.md')` we retrieve the Renderer object for the Markdown renderer.

The Markdown Renderer object has a `use` method that simply turns around and calls the `use` method on the Markdown-it instance.  Therefore the options object that is passed here is exactly as is documented on [the `markdown-it-plantuml` repository](https://github.com/gmunguia/markdown-it-plantuml).

Then to test it, you can browse the PlantUML website for sample diagrams.  Simply paste the diagram off their website into your Markdown file.  See the sample below.

What happens is an `<img>` tag is inserted that refers to a URL on the PlantUML website.  This URL retrieves the SVG or PNG image containing the UML diagram.

Since it's not exactly good form to cause a heavy load on a 3rd party website, it's a good idea to download that image to your own server.  Unfortunately the `markdown-it-plantuml` plugin does not provide a way to do that.  But the `akashacms-dlassets` plugin is designed to download images from 3rd party sites and to rewrite `<img>` tags to refer to the downloaded image.  Using that plugin will ensure we do not load the PlantUML website any more than necessary.

```json
"akashacms-dlassets": "github:akashacms/akashacms-dlassets",
```

Add that to your `package.json` dependencies, and then rerun `npm install`.

Then in `config.js` add the corresponding entry to enable the `dlassets` plugin:

```js
config.use(require('akashacms-dlassets'))
```

There is no further configuration required for this plugin, at this time.

# Sample UML file

```
@startuml
actor Foo1
boundary Foo2
control Foo3
entity Foo4
database Foo5
collections Foo6
Foo1 -> Foo2 : To boundary
Foo1 -> Foo3 : To control
Foo1 -> Foo4 : To entity
Foo1 -> Foo5 : To database
Foo1 -> Foo6 : To collections

@enduml
```


@startuml
actor Foo1
boundary Foo2
control Foo3
entity Foo4
database Foo5
collections Foo6
Foo1 -> Foo2 : To boundary
Foo1 -> Foo3 : To control
Foo1 -> Foo4 : To entity
Foo1 -> Foo5 : To database
Foo1 -> Foo6 : To collections

@enduml


