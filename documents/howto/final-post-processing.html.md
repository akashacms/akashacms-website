---
layout: blog.html.njk
title: Running Mahabhuta one last time - final post-processing
rightsidebar:
publicationDate: May 20, 2015
blogtag: howto
---

Sometimes, no matter how perfect is your chain of Mahabhuta functions, there's something to do once when the whole document is ready.  While AkashaCMS renders documents, it runs the Mahabhuta functions several times.  Usually that's enough to ensure the document is completely processed before it's written to the `root_out` directory.  But of course there are corner cases to accomodate.

For example, in AkashaEPUB I needed to modify the URL's of every `link`, `img` or `a` tag while ensuring each tag was processed only once.  To block multiple processing, I added a marker attribute (`ak-mapped="yes"`) that needed to be removed before writing the rendered file to disk.  Removing that marker attribute needs to occur at the end of processing, immediately before writing to disk.

AkashaCMS emits events at various points through processing documents.  One of those occurs at the very end, after rendering is finished and just before the content is written to disk.

Here's how you do it:

```
akasha.emitter.on('file-rendered', function(config, entryPath, renderTo, rendered, done) {
    akasha.mahabhuta.process(rendered.content, {
        documentPath: entryPath
    }, postRenderMahafuncs, function(err, newrendered) {
        if (err) done(err);
        else { rendered.content = newrendered; done(); }
    });
});
```

The `akasha.emitter.on` function registers to receive events from AkashaCMS.  Now, while this looks like a normal Node.js EventEmitter it has one significant difference.  It sends a callback function that needs to be called to acknowledge the event and provide results.  The Node.js EventEmitter simply sends events with no hand-shaking from recipients.

In this case we invoke Mahabhuta on a Mahafuncs array named `postRenderMahafuncs` which does what I mentioned earlier.  It's not really important what that is, suffice to say that some Mahabhuta functions are being executed.

The important bit is that the modified content arrives in the variable named `newrendered` which we assign to `rendered.content`.  This has a side-effect of the changing the caller's copy of the `rendered` object, which achieves the result we want - performing a final modification just before the rendered content is written to disk.
