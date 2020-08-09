---
layout: blog.html.njk
title: Collapsing figure/img tags into simplified fig-img tag
publicationDate: August 11, 2017
blogtag: news
teaser: |
    <p>A purpose of a system like AkashaCMS is simplifying the work of content authors to more efficiently write their content.  The task of simplifying work is multi-faceted and can be taken in many different directions.</p>

    <p>The task at hand was to collapse the &lt;figure&gt;/&lt;img&gt; combination into a simplified tag.</p>

    <p>This combination is the preferred way of presenting images, especially when there's to be a caption.</p>
---

The typical pattern is:

```
<figure>
<img src="/path/to/some-image.jpg"/>
<figcaption>Caption text including Source: BBC</figcaption>
</figure>
```

While the HTML isn't all that extensive it can be tedious to write this over and over.  The simplification?

```
<fig-img href="/path/to/some-image.jpg"/>
Caption text including Source: BBC
</fig-img>
```

For complete information see: [](/plugins/built-in/index.html)
