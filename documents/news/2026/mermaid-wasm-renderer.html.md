---
layout: blog.html.njk
title: Announcing Rust-based mermaid rendering in AkashaCMS 0.10 projects
publicationDate: July 4, 2026
blogtag: news
teaser: |
    The PDF Document Maker application proves that simplified integration of diagram-making tools (PlantUML, Mermaid, Pintora) brings excellence to AkashaCMS.  But, integrating Mermaid required using Puppeteer and a headless web browser, at a high cost to CPU and node_modules size.  Fortunately, a route was found where recompiling the Rust-based Mermaid renderer to WASM enables coolness.
heroPicture:
---

Words alone are not the essence of communication.  It's helpful for us to communicate not just with words, but sound, images, and video.

For example, writing technical documentation for software design is helped with some diagrams.  An example is this doozy I created to help describe how the PDF Document Maker application works:

<diagrams-mermaid
        id="pdf-document-maker-sequence"
        alt="Document workflow in PDF Document Maker"
        title="Document workflow in PDF Document Maker"
        caption="Document workflow in PDF Document Maker"
        input-file='./img/pdf-document-workflow.mmd'/>

Browse through the [PDF Document Maker online guide](https://akashacms.github.io/pdf-document-construction-set/guide/guide.html) and you see a careful mix of words, code snippets, and diagrams, to explain how this application works.  Towards the bottom of that page is the diagram shown here.

In an AkashaCMS project, one starts with adding the `@akashacms/diagram-makers` package.  It brings three different diagram rendering systems into AkashaCMS projects.  These are:

* **PlantUML** - A Java-based platform for diagram rendering.  The package includes the sizeable JAR file, and requires separately installing the Java runtime on your computer.  See https://plantuml.com/ for documentation
* **Mermaid** - This is a JavaScript platform for diagram rendering primarily meant for in-browser rendering.  To use it in Node.js meant leveraging Puppeteer for a headless browser, at a high deployment and CPU cost.  In the 0.10 release, the `@akashacms/diagram-makers` package integrates a Rust-based Mermaid implementation, which has been recompiled as a WASM module.  See https://mermaid.ai/open-source/ for language documentation
* **Pintora** - This is a JavaScript framework that easily runs in Node.js for diagram rendering.  See https://pintorajs.vercel.app/ for documentation

What's new today is that Mermaid support is now slimmed down, and much faster, due to the WASM version of the Rust-based Mermaid renderer.

At the moment, to set this up one must use the 0.10 version of the AkashaCMS platform.  The current released version, available through NPM, is 0.9.  To use 0.10 requires installing directly from the 0.10 branch on certain GitHub repositories.

In your `package.json` set up dependencies this way:

```json
{
    "dependencies": {
        // ...
        "@akashacms/plugins-base": "akashacms/akashacms-base#0.10",
        "@akashacms/plugins-blog-podcast": "akashacms/akashacms-blog-podcast#0.10",
        "@akashacms/diagram-makers": "akashacms/plugins-diagrams#0.10",
        "akasharender": "akashacms/akasharender#0.10",
        // ...
    }
}
```

Next, in `config.mjs`:

```js
import {
    DiagramsPlugin,
    MarkdownITMermaidPlugin
} from '@akashacms/diagram-makers';

config.findRendererName('.html.md')
    .use(MarkdownITMermaidPlugin, {
        // All options are optional
        // themePreset: 'forest',
        // configJSON: await fsp.readFile('mermaid-config.json', 'utf-8'),
        // fontFNs: [ '/path/to/Roboto.ttf' ]
    });

config
    // ...
    .use(DiagramsPlugin)
    // ...
```

The `MarkdownITMermaidPlugin` enables a code-fence mode for placing Mermaid documents in-line in Markdown documents.

The `DiagramsPlugin` adds several custom elements such as `<diagrams-mermaid>` for rendering diagrams within an AkashaCMS document.

There are a lot of options and features to this, all of which are documented in the 0.10 README: https://github.com/akashacms/plugins-diagrams/tree/0.10

# Bottom line

The `@akashacms/diagram-makers` plugin allows AkashaCMS users to easily integrate diagrams with their documents.

The tradeoffs for the three supported diagram frameworks are:

* PlantUML is the most capable and feature-filled, but the AkashaCMS integration requires shipping a large JAR file with the package, and launching a Java VM child process for each rendered image.  It is unavoidable that this is a heavy CPU cost.
* Mermaid is not as feature-filled as PlantUML, but is very capable, plus it has a larger and more excited community of users.  With the mermaid-wasm-renderer support, Mermaid rendering in AkashaCMS is very performant.
* Pintora is less feature-filled than Mermaid.  As I have not used it much, I cannot comment on its performance.  However, it did not carry the high deployment burden of a large JAR file or required installation/launch of a headless browser.

In other words, Mermaid probably hits a sweet spot of capability and performance.


