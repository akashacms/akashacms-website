---
layout: blog.html.njk
title: Importing content from a Drupal website to AkashaCMS
publicationDate: November 28, 2021
blogtag: news
teaser: |
    Drupal is an excellent content management system that serves a long list of major organizations.  With an open source CMS (Drupal, Wordpress, etc), what happens when you want to move the content to another CMS platform or use it for other purposes?  How easily can you export your content from one CMS and import it into another CMS?  In this post we explore converting content held in a Drupal website to be used by AkashaCMS.
heroPicture:
    url: /news/2021/11/img/import-web-content.jpg
    caption: Drupal logo by Drupal, overall image by David Herron.
---


In the 00's I became a Drupal expert, and built several websites using Drupal.  I have two sites remaining, one (`davidherron.com`) is a personal blog, and the other (`visforvoltage.org`) is a busy and active community website.  The task today is converting my personal blog into an AkashaCMS website.  AkashaCMS is a static html website generator platform.

That means retrieving the content out of a Drupal 7 website and converting it into a form suitable for AkashaCMS.  This means simple text files, with YAML formatted front-matter, and a body written in Markdown or AsciiDoc.

Drupal is an open source content management system that's existed for well over 20 years.  When I started with Drupal, the goal was to establish community websites in order to implement positive social change.  At the time Drupal's tagline was "_Community Plumbing_", but it seems to have transitioned from that to something like "_Big Websites for Big Enterprises_".  The one success I had was VisForVoltage, which is about electric vehicle adoption, a goal I very much support.

A general issue with "_content creation_" is whether the content you've created is portable among different software tools or presentation.  For example, with standard image formats (PNG, JPEG, etc) your image can be brought into any paint program for manipulation.  But, each paint program has an extended image format where that program records precisely the manipulations you've implemented, and as a general rule those extended images are not portable to other applications.   At one time, I implemented a redesign of a major Drupal website (`plugincars.com`), and the designer gave me PSD (Photoshop) files containing assets.  While I was able to make limited use of these files in Gimp, those assets were somewhat trapped within the PSD file in a way that Adobe surely hoped would encourage me to buy Photoshop.

With content management systems, you enter your text and images, and the CMS displays it on a website.  But, the content is then in a database.  How easily can you independently access the content, and perhaps use it for other purposes?  With Wordpress and Blogger, both support an export file (XML) containing the content, but there isn't a well defined export format that is portable between CMS's.  In Drupal, there are a couple modules that sort of provide content export, but as we'll see they're clumsy.  With systems like AkashaCMS, the content is simply files on the file system, and are easily reusable elsewhere.

# Drupal 7 modules for exporting content

The website in question is on Drupal 7.  I didn't have the time to upgrade it to Drupal 8 or Drupal 9.  It's possible the choices for either D8 or D9 content export are different.

The modules I chose are:

* Content export using - [Node Export](https://www.drupal.org/project/node_export)
* Vocabulary export using - [Taxonomy Export CSV](https://www.drupal.org/project/taxonomy_export_csv) - And - [Taxonomy CSV](https://www.drupal.org/project/taxonomy_csv)

In Drupal, _Node_'s are where content is stored.  That's probably overly simplistic as later Drupal versions use Entity objects.  My expertise was in Drupal 6, FWIW.  Starting with Drupal 7, it became easily possible to extend Node types with additional fields beyond the typical "_title_" and "_body_".  The implementation meant the data for each node became spread among multiple tables, making it increasingly difficult to write a simple SQL query to extract the data.

I could possibly have done a custom export using a View created using Views.  The Views module allows for arbitrary queries on the data held in a Drupal instance.  Or, I could have written a custom SQL query.  But, as I just said, that's increasingly difficult as the Drupal database schema becomes ever more complex.  But, I chose the _Node Export_ module because it exactly did the task, and its output format is simple portable JSON.

After installing and enabling the module, you go to the `admin/config/content/node_export` URL and set up export options.  I chose JSON as the export format since it is the most portable.

Next, at the `admin/content` URL, use the filter to select the content you want to work on, then in the _Update Option_ areas chose _Node Export_.  This brings up a window containing a text box with a JSON object, and a button letting you download that JSON.  You are presented with a few content items at a time, so repeat this for each block of items.  You end up with a bunch of JSON files.

Upon studying the Drupal exported JSON data, you'll find that vocabulary terms are described this way:

```json
"taxonomy_vocabulary_1": {
   "und": [
       {
           "tid": "152"
       }
   ]
},
```

This node has, for `taxonomy_vocabulary_1`, a single Tag, where the Term ID is `152`.  What's needed is converting this Term ID to the Term Name.  That mapping is held in the database, which meant turning to another export module.

The _Taxonomy Export CSV_ module exported a complex CSV file with lots of fields.  By contrast, _Taxonomy CSV_ exported a simple CSV file with just Term ID and Term Name fields.

To use this module, go to `admin/config/system/migrate_taxonomy` and on that page select the vocabulary to export.  Click the _Export_ button, and after awhile you'll be given a URL for the CSV file that you can download.

# Examining the data exported from Drupal by the Node Export module

To understand how we'll proceed with converting this data, let's crack open and study the JSON file generated by the Node Export module.

The first thing we notice is that each one is a JSON array containing objects, which is exactly what we'd expect.  To examine the JSON data structure, let's take a look at one:

```json
{
    "vid": "7930",
    "uid": "0",
    "title": "Backbone.js Tutorial: Google\u0026#39;s APIs and RequireJS",
    "log": "",
    "status": "0",
    "comment": "1",
    "promote": "0",
    "sticky": "0",
    "vuuid": "766fc29b-30da-4338-8375-b1949a8a0f5f",
    "nid": "7930",
    "type": "blog",
    "language": "und",
    "created": "1354824780",
    "changed": "1505972592",
    "tnid": "0",
    "translate": "0",
    "uuid": "d40c8eb0-7ae2-4319-ba3a-171c98993bf5",
    "revision_timestamp": "1505972592",
    "revision_uid": "1",
    "taxonomy_vocabulary_59": [],
    "taxonomy_vocabulary_58": [],
    "taxonomy_vocabulary_1": {
        "und": [
            {
                "tid": "2372"
            }
        ]
    },
    "body": {
        "und": [
            {
                "value": "...  ",
                "summary": "",
                "format": "1"
            }
        ]
    },
    "upload": [],
    "field_link": [],
    "microdata": {
        "#attributes": {
            "itemscope": "",
            "itemid": "https:\/\/davidherron.com\/OLD-blog\/2014-04-26\/backbonejs-tutorial-googles-apis-and-requirejs"
        },
        "title": {
            "#attributes": []
        },
        "taxonomy_vocabulary_59": {
            "#attributes": []
        },
        "taxonomy_vocabulary_58": {
            "#attributes": []
        },
        "taxonomy_vocabulary_1": {
            "#attributes": []
        },
        "body": {
            "#attributes": [],
            "value": {
                "#attributes": []
            },
            "summary": {
                "#attributes": []
            }
        },
        "upload": {
            "#attributes": []
        },
        "field_link": {
            "#attributes": []
        }
    },
    "rdf_mapping": {
        "rdftype": [
            "sioc:Post",
            "sioct:BlogPost"
        ],
        "title": {
            "predicates": [
                "dc:title"
            ]
        },
        "created": {
            "predicates": [
                "dc:date",
                "dc:created"
            ],
            "datatype": "xsd:dateTime",
            "callback": "date_iso8601"
        },
        "changed": {
            "predicates": [
                "dc:modified"
            ],
            "datatype": "xsd:dateTime",
            "callback": "date_iso8601"
        },
        "body": {
            "predicates": [
                "content:encoded"
            ]
        },
        "uid": {
            "predicates": [
                "sioc:has_creator"
            ],
            "type": "rel"
        },
        "name": {
            "predicates": [
                "foaf:name"
            ]
        },
        "comment_count": {
            "predicates": [
                "sioc:num_replies"
            ],
            "datatype": "xsd:integer"
        },
        "last_activity": {
            "predicates": [
                "sioc:last_activity_date"
            ],
            "datatype": "xsd:dateTime",
            "callback": "date_iso8601"
        }
    },
    "path": {
        "pid": "67042",
        "source": "node\/7930",
        "alias": "OLD-blog\/2014-04-26\/backbonejs-tutorial-googles-apis-and-requirejs",
        "language": "und"
    },
    "cid": "0",
    "last_comment_timestamp": "1398540323",
    "last_comment_name": null,
    "last_comment_uid": "0",
    "comment_count": "0",
    "name": "",
    "picture": "0",
    "data": null,
    "menu": null,
    "node_export_drupal_version": "7",
    "node_export_book": {
        "weight": 0,
        "#is_root": false
    },
    "#node_export_object": "1"
},
```

Of this, the fields I'm interested in are:

* `title`
* `created`, `updated`
* `taxonomy_vocabulary_1.und`  -- This corresponds to my _Topics_ vocabulary
* `body.und[0]` -- I didn't bother to find out if there were Nodes with more than one entry in this array.  There was at least two which had 0 entries in this array.
* `path.source` and `path.alias`

From the data in these fields, I can construct suitable AkashaCMS content files.

Since this says `"status": "0"` it's possible this particular node is not published.  It may or may not be important to you to respect whether a particular content node is published, or not published.  Drupal respects that status, and does not display content which is not published.  In my case, I want to retrieve all my old content, even the non-published stuff.

# AkashaCMS content format

Our [_Getting Started_](/quick-start/index.html) guide contains information on the [AkashaCMS content file format](/quick-start/content.html)

The quick summary is that text content files are written using either Markdown or AsciiDoc, and follow this format:

```
---
title: Article title
publicationDate: September 22, 2022
tags:
    - tag1
    - tag2
layout: blog.html.ejs
---

Content text
```

The game plan is fairly simple.  Read in each JSON file, step through the items, convert the taxonomy term ID's to term names, and output a file in this format for each entry.

# First analysis of JSON from the Node Export module

Start by writing a quickie script to try out reading the data.

```js
import { promises as fs } from 'fs';

const txt = await fs.readFile(process.argv[2], 'utf8');
const data = JSON.parse(txt);

for (let datum of data) {
    console.log(`
vuuid: ${datum.vuuid}
uuid: ${datum.uuid}
nid: ${datum.nid}
type: ${datum.type}
created: ${datum.created} ${new Date(datum.created * 1000).toDateString()}
changed: ${datum.changed} ${new Date(datum.changed * 1000).toDateString()}
pathD: ${datum.path.source}
path: ${datum.path.alias}
fullpath: ${datum.microdata['#attributes'].itemid}
name: ${datum.name}
title: ${datum.title}
body: ${datum.body.und[0].value}
`)
}
```

It's nice that JSON is a JavaScript-native data format, so we have `JSON.parse` available.  All we do here is read the file, using `JSON.parse`, then loop through the items, printing the data to make sure about it.

The `datum.created` and `changed` fields did not convert into a useful Date string unless the values were multiplied by `1000`.  Otherwise this turned out good, and verified that the JSON was usable as it is.

# Converting the JSON data from Node Export, producing AkashaCMS documents

What I did is write a script in ES6 module format, allowing us to use [top-level async/await constructs](https://techsparx.com/nodejs/async/top-level-async.html), a technique letting us write simple scripts in Node.js.  The script reads one JSON, processes each item in the array, producing one output file for each item.

```js
import { promises as fsp } from 'fs';
import fs from 'fs';
import path from 'path';
import url from 'url';
import fsextra from 'fs-extra';
import { parse } from 'csv-parse';
import cheerio from 'cheerio';

const nodexfn = process.argv[2];
const vocabfn = process.argv[3];

const txt = await fsp.readFile(nodexfn, 'utf8');
const data = JSON.parse(txt);
```

I ended up using both the `fs/promises` and regular `fs` modules, and additionally a function from `fs-extra`.  To read the Taxonomy CSV file, I used `csv-parse`.  For modifying the HTML, I used `cheerio`, which is an implementation of part of the jQuery API running in Node.js.

The variable `data` ends up with the parsed JSON.

### Reading vocabulary terms exported with Taxonomy CSV

Next, lets read the taxonomy data into an array.

```js
// Read the CSV file using Node.js streaming
const parser = fs.createReadStream(vocabfn).pipe(parse({
    delimiter: ',',
    // columns: true,
    relax_column_count: true
}));


// In the vocabulary data file, the terms look like:
//
// [ '2267', 'Xen' ]
//
// What we're doing in this loop is setting up 'vocab'
// as so - for the index of Term ID, assign the Term Name
//
// vocab[ID] = TERM


const vocab = [];

for await (let row of parser) {
    let o = {
        tid: row[0],
        term: row[1]
    };
    vocab[o.tid] = o.term;
}
```

This is one way to [read CSV files](https://techsparx.com/nodejs/howto/csv2mysql.html).  The first part produces an iterable object, and we iterate over that object in the second half.  For output from the _Taxonomy CSV_ module, each row has two items as shown in the comments here.  The first is the Term ID, the second is the Term Name.  What we do in this loop is set up the `vocab` array to map from ID to Name.

### Determining the file name to use, and RedirectMatch commands for `.htaccess`

Before constructing an output file, we need to know its file name.  And, we need to generate `RedirectMatch` commands for old URL paths.

```js
// Store RedirectMatch commands in this string
// Will write to a file at the end
let htaccess = '';
```

In this variable we'll store `RedirectMatch` commands.  To understand what this is about, take a look at the two path strings:

```json
"path": {
    "pid": "67042",
    "source": "node\/7930",
    "alias": "blog\/2014-04-26\/backbonejs-tutorial-googles-apis-and-requirejs"
}
```

Each _Node_ in a Drupal website has a _Node Number_, and the default URL is `/node/NNNN`.  That's what we see in the `path.source` field.  My habit is to instead use the Pathalias module which automatically sets up user-friendly aliases.  This is an example of one pattern I'd used, where the path alias had a date string in the middle, and contained the title turned into a URL slug.

Ideally we'll have the new content landing on URL's similar to this, and further we'll use `.htaccess` rules (_RedirectMatch_) to redirect traffic landing on an old URL to the correct URL.

For example the URL path in the `path.alias` field is not directly usable by AkashaCMS.  That's because all paths in AkashaCMS sites end with `.html`.  At the minimum we need two RedirectMatch rules, for the `path.source` and the `path.alias`, redirecting to a new URL path that we generate.

### A loop to process Node data from Node Export module

As promised, we will loop over each entry read from the JSON file, process that entry, and produce an output file.

```js
for await (let datum of data) {
    if (!datum.body || !datum.body.und || datum.body.und.length === 0) {
        console.log(`DATUM HAS NO BODY`, datum.body);
        continue;
    }
    let alias = datum.path.alias;
    let aliasfn = alias + '.html.md';
    let fn = path.join('documents', 'archive', 'davidherron.com', aliasfn);

    await fsextra.ensureDir(path.dirname(fn));

...
}
```

Because there will be several asynchronous operations, we put an `await` keyword on the `for` loop.

If the particular data item does not have any `body` entries, we can skip that item.  In the data I had available, there were two such items.

Next, we construct `aliasfn` to be the `alias` value with `.html.md` tacked on the end.  This is the file name we use in AkashaCMS for Markdown files.

The `fn` variable contains the path within the `documents` directory where we'll write the final file.  The `documents` directory in AkashaCMS contains all the documents for a particular site.  What I want to do is treat the content from the old site as a kind of archive.  I'll also import content from several Blogger blogs I launched, putting each under the `archive` directory.

In other words `fn` will contain a path name like - `archive/davidherron.com/path/to/article-title.html.md`

The last thing shown here is to ensure the named directory exists.

The next thing is to generate the `tags` field for the content file.  There might be zero tags in a given Node, in which case there should not be a `tags` field.  Otherwise it should be a YAML array as shown above.

```js
let tags = '';
if (datum.taxonomy_vocabulary_1 
 && datum.taxonomy_vocabulary_1.und
 && datum.taxonomy_vocabulary_1.und.length > 0) {
    tags = 'tags:';
    for (let row of datum.taxonomy_vocabulary_1.und) {
        // Handle this:   Community: 'Mobile & Embedded' 
        // In other words, in the YAML have "Tag String"
        // And if "Tag String" has a double-quote, replace
        // that with '\\"'
        //
        //    tags:
        //       - "Community: 'Mobile & Embedded'"
        let term = vocab[row.tid] ? vocab[row.tid] : '';
        tags += `\n    - "${term.replaceAll('"', '\\"')}"`;
    }
}
```

This loops through the `taxonomy_vocabulary_1` field, generating an array entry for `tags` for each.

Because one of the taxonomy terms was "_Community: Mobile & Embedded_" it was not possible to use that directly in the YAML.  That meant putting double-quotes around each taxonomy term name.  And then, if a particular taxonomy term were to have double-quotes in the term name, we used `replaceAll` to add a backslash to hide the double-quote inside the double-quoted string.

The next part is to process the HTML to fix up some issues.  Primarily there are `<a>` and `<img>` tags in which to change the URL.  But, there is a first issue to take care of is `<code>` tags in Drupal content.

```js
let $ = cheerio.load(datum.body.und[0].value);

$('code').each(function (index) {
    // This is needed because there can be <code></code>
    // elements containing other HTML that contain
    // <a></a> or <img> elements that might be modified
    // below.  But, in a Drupal post, <code></code> is stuff
    // that is ignored by the Drupal renderer, and should 
    // therefore be converted to ```...``` in Markdown.
    //
    // Another issue is what the Drupal export does for
    // <code> </code> structures that contain PHP code.
    // It was observed to be converted to messed up
    // code as if the export process tried to defang the
    // PHP but failed to do so with all of it, and some
    // of the PHP executed instead.
    //
    // For such cases it is necessary to go to the original
    // post and copy over the text into ```...```
    //
    // Convert <code>...</code> into:
    // ```
    // ...
    // ```
    const inner = $(this).html();
    if (inner.includes('<!--?php')) {
        console.log(`********** ${alias} contains possibly mangled PHP ${inner}`);
    }
    $(this).replaceWith(`
\`\`\`
${inner}
\`\`\`
`)
});

// There may have been HTML code inside a <code></code>
// block that is now hidden inside ```...```
// But the $ variable still has it as HTML inside <code></code>
// Hence, need to rewrite the HTML and reparse it
const newtext = $.html();
$ = cheerio.load(newtext);
```

The `cheerio.load` is how you convert HTML text into a `$` variable that operates like the `$` produced by jQuery.  I have a lot of experience with Cheerio, because a core part of AkashaCMS is a package, Mahabhuta, that uses Cheerio to drive DOM manipulation while rendering a static website.

This first code stanza looks for `<code>` tags.  In Drupal - at least, in the way I used Drupal to create content - the `<code>` tag was the way to hide _code_ like snippets of software, or HTML tags, or whatnot.  Because I write a lot of programming tutorials, quite a few posts on `davidherron.com` have `<code>` tags.

What I found was that a `<code>` tag containing other HTML, including `<a>` or `<img>` tags, needed to be rewritten to use the Markdown construct with three backquotes to hide such code.  Otherwise, Cheerio was going to recognize the `<a>` or `<img>` tags within a `<code>` tag and my code below would go ahead and modify those tags.  By putting that code inside the three-backquotes construct, Cheerio won't see those tags, and they won't be modified.

What this stanza does is to find `<code>` tags, and replace them with the three-backquote construct as discussed in the comments above.

There's another issue to discuss, which is about how Node Export handles `<code>` elements that includes PHP code.

```html
<code>
<footer id="colophon" role="contentinfo">
<div class="site-info">
<?php do_action( 'twentytwelve_credits' ); ?>
<a href="<?php echo esc_url( __( 'http://wordpress.org/', 'twentytwelve' ) ); ?>" title="<?php esc_attr_e( 'Semantic Personal Publishing Platform', 'twentytwelve' ); ?>"><?php printf( __( 'Proudly powered by %s', 'twentytwelve' ), 'WordPress' ); ?></a>
</div><!-- .site-info -->
</footer><!-- #colophon -->
</code>
```

This is an example from a posting on the current `davidherron.com` site.  However, Node Export mangled this code to this:

```html
<code>
<footer id="colophon" role="contentinfo">
        <div class="site-info">
                <!--?php do_action( 'twentytwelve_credits' ); ?-->
                <a href="<?php echo esc_url( __( 'http://wordpress.org/', 'twentytwelve' ) ); ?>" title="<?php esc_attr_e( 'Semantic Personal Publishing Platform', 'twentytwelve' ); ?>"><!--?php printf( __( 'Proudly powered by %s', 'twentytwelve' ), 'WordPress' ); ?--></a>
        </div><!-- .site-info -->
</footer><!-- #colophon -->
</code>
```

I suspect there's a bit of security dance going on here.  It would not be good for PHP code embedded in some content to execute on the server while the page is being rendered.  But, whatever the reason, this content has been mangled and is not what's in the Node.

There doesn't seem to be a way to demangle this mangling.  What the script does instead is to print a message for the user, so they can go to the original content and manually copy the correct text.

It then turns `$` back into HTML, and then creates a new `$` from that HTML.

Why do we do this?  Isn't it a performance hit?  Yes, it is a performance hit, but there is a very clear reason to do this.

There are two more code stanza's remaining, one to search out `<a>` tags, the other `<img>` tags.  The purpose was to convert potential `<code>...<a></a>...</code>` constructs into something Cheerio will not see and modify.

The previous stanza took care of hiding that code.  We serialized and reparsed the HTML to make doubly sure the following stanza's wouldn't see these constructs.

```js
$('a').each(function (index) {
    const href = $(this).attr('href');
    // href can be undefined
    const urlp = href ? url.parse(href, true, true) : {};
    // console.log(`url ${href} ==> `, urlp);
    if (urlp.protocol || urlp.slashes || urlp.host) {
        // remote URL, ignore
    } else if (urlp.pathname) {
        // In some cases every field is empty
        // local URL, need to fix this
        // Trim off any trailing slash so we can append '.html'
        const pathname = urlp.pathname.endsWith('/')
                    ? urlp.pathname.substr(0, urlp.pathname.length - 1)
                    : urlp.pathname;
        const newpath = path.join('/', 'archive', 'davidherron.com',
                                    pathname + '.html');
        // console.log(newpath);
        $(this).attr('href', newpath);

        // These handle any traffic arriving on old URL's
        const node = alias.substr(1);
        htaccess += `RedirectMatch ^${datum.path.source} ${newpath}\n`;
        htaccess += `RedirectMatch ^${alias} ${newpath}\n`;
    } else {
        // console.log(`url ${href} ==> `, urlp);
    }
});
```

This stanza looks for `<a>` tags.  For local URL's, meaning referring to a URL within the website, we need to rewrite the URL to match the new file path.

The `href` variable holds the contents of the `href` attribute.  This is supposed to be a URL.  But there are three conditions: 

1. A link to an external site that should not be modified
    * TODO: Need to handle links to `http://davidherron.com`
1. Local links, that do not have a `protocol`, `slashes` or `host`
    * These need to be rewritten for the new pathname as discussed above
1. Anything else -- It turned out that some links simply had `#`

Why did I not use the `URL` object?  In the Node.js documentation for the built-in `url` module, it clearly says to stop using the old `url` object functions.  Instead we're supposed to use the WHATWG URL object because it's better and doesn't have a certain bug.

But, consider this:

```
$ node --version
v16.13.0
$ node
Welcome to Node.js v16.13.0.
Type ".help" for more information.
> let u = new URL('/foo/bar');
Uncaught TypeError [ERR_INVALID_URL]: Invalid URL
    at __node_internal_captureLargerStackTrace (node:internal/errors:464:5)
    at new NodeError (node:internal/errors:371:5)
    at onParseError (node:internal/url:552:9)
    at new URL (node:internal/url:628:5) {
  input: '/foo/bar',
  code: 'ERR_INVALID_URL'
}
> 
```

Many of the URL's I had to process were `/foo/bar/somewhere/article-title-string`, and therefore are not something that the `URL` object will parse.

I don't quite know how this is going to work going forward once the Node.js team follows through and removes the old `url` support.  There are times when our applications legitimately must process a URL string that might be a simple URL path.  What will we do?

In any case, `/foo/bar/somewhere/article-title-string` gets converted to `/archive/davidherron.com/foo/bar/somewhere/article-title-string`, as discussed earlier.  For the purpose of being a file name, we trim off any trailing `/` then append `.html`.

Next we process `<img>` tags

```js
$('img').each(function (index) {
    const href = $(this).attr('src');
    // href can be undefined
    const urlp = href ? url.parse(href, true, true) : {};
    if (urlp.protocol || urlp.slashes || urlp.host) {
        // remote URL, ignore
    } else if (urlp.pathname) {
        // In some cases every field is empty
        // local URL, need to fix this

        // We have separately arranged for /sites/defaults/files
        // from the site to be mounted as
        // /archive/davidherron.com/sites/default/files
        // Hence we can simply rewrite the image URL's accordingly
        const newpath = path.join('/', 'archive', 'davidherron.com',
                                    urlp.pathname);
        $(this).attr('src', newpath);
    }
});
```

For locally hosted image files, their paths primarily start with `/sites/default/files` because that's where Drupal stores uploaded files.  What I did was to download the `/sites/default/files` directory from the `davidherron.com` site, and add it to my project such that they appear at `/archive/davidherron.com/sites/default/files`.

That meant we can simply rewrite `<img src="...">` tags to prepend `/archive/davidherron.com` as shown here.

I could have instead used the `fetch` module to download the image and then somehow construct a new path name.  But, this is much simpler.

Having modified the HTML in the `$` object, let's write it out to a file.

```js
await fsp.writeFile(fn, `---
title: |
    ${datum.title.replaceAll('\n', ' ')}
layout: blog.html.ejs
blogtag: davidherron
publishedDate: ${new Date(datum.changed * 1000).toDateString()}
${tags}
drupal:
    vuuid: ${datum.vuuid}
    uuid: ${datum.uuid}
    nid: ${datum.nid}
    type: ${datum.type}
    pathD: ${datum.path.source}
    path: ${datum.path.alias}
    fullpath: ${datum.microdata['#attributes'].itemid}
    name: ${datum.name}
---

${$.html()}
`);
```

Remember that `fn` is `/archive/davidherron.com/path/to/article-title-string.html.md`.  And, earlier we ensured that this directory already exists.

This writes the YAML-formatted front-matter, and uses `$.html()` to serialize the `$` object to HTML.

Some title strings had special characters in them which did not sit well with YAML.  It seemed better to use this construct to hide those special characters.  A couple of the title strings had `\n` characters, which we had to remove.

The final thing we do in this script is after the end of this loop.  Namely, we have `.htaccess` file entries to write to disk.

```js
await fsp.writeFile('htaccess', htaccess, {
    flag: 'a'
});
```

Why use the `flag: 'a'`?  It's because we're running this script once for each JSON file, meaning we'll run the script multiple times.

### Running the script to convert Node Export data to AkashaCMS content files

To run the above script, I did this:

```sh
# Ensure we create a new htaccess
rm -f htaccess

for f in *.json; do
echo $f
node import.mjs $f taxocsv.csv
done
```

This is a BASH script.  To process the group of files, we run this.  It starts with removing any existing `htaccess` file so that the `.htaccess` entries solely come from this processing run.  The `taxocsv.csv` file is what we got from running the _Taxonomy CSV_ module.

# Summary

We've demonstrated some techniques to consider when exporting content from a Drupal 7 website.  The techniques may apply to Drupal 8 or later websites, but I have no experience with those versions and simply do not know.

In my mind there is a huge question.  Why isn't this a core capability of Drupal?  Why did I have to install add-on modules?
