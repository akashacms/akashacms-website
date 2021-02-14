---
layout: blog.html.njk
title: 'How to set rel=nofollow or affiliate tags in external links in a Node.js web application'
publicationDate: March 27, 2019
blogtag: news
teaser: |
    Setting <em>rel=nofollow</em> or other attributes on outbound links is critically important.  Search engines take a dim view of outbound links where there is a monetary gain -- e.g. an affiliate link -- that lack the <em>rel=nofollow</em> attribute.  Automatically setting appropriate affiliate referral codes on all relevant external links is important for fully monetizing external links.  In this article we'll go over a new package that handles both those tasks.  It has an easy-to-use API where HTML enters the processor, and processed HTML is given as a result.  The methodology can be expanded to handle approximately a zillion other HTML DOM processing tasks.
---

# Scope of this external link processor package

Let's first discuss the scope of this package.  There are two major topic areas which are not exactly common, but are unified because both areas deal with manipulating outbound links.  There are significant SEO implications for correctly setting certain attributes on outbound links, and there are significant monetization implications for correctly setting affiliate tags in outbound links.

The `rel=nofollow` informs search engines to not flow "link juice" through an outbound link.  The phrase "link juice" refers to the weight search engines apply to a given web page based on the number of inbound links to that page.  There are several occasions where a site will want to apply `rel=nofollow`:

* Poor quality scammy sites - the site may want to link to such a site, but not in a way which gives a boost to the site.  Search engines take a dim view of sites which link to scammy or poor quality sites.  Adding `rel=nofollow` is the solution
* At the other end of the scale, some of us feel that sites like `cnn.com` or `wikipedia.org` or `nytimes.com` have enough "link juice" flowing to them, and therefore it is not necessary to give them any more weight than they already have
* More recently government policies place requirements on links that earn money, including adding `rel=nofollow`

An affiliate link is a way to earn revenue through being paid commissions by sites based on the visitors you send to the site.  The stereotypical example is the Amazon Affiliates program, in which you link to an Amazon product page and if the visitors you send to Amazon buy things Amazon will pay a commission.  Often this involves a tag added to the `query` portion of a URL to identify which affiliate sent that visitor to account for the purchases and commissions.

# Installation

This is a Node.js package and is installed as so:

```shell
$ npm install @mahabhuta/external-affiliate-links --save
```

In a Node.js program it can be used as so:

```js
const processor = require('@mahabhuta/external-affiliate-links');
const fs = require('fs-extra');
const program   = require('commander');

program
    .command('process <htmlFN>')
    .description('Process an HTML file')
    .action(async (htmlFN) => {

        const htmlIN = await fs.readFile(htmlFN, 'utf8');
        const htmlOUT = await processor.process(htmlIN, {}, {
            // options
        });
        console.log(`****** process got input HTML\n`, htmlIN)
        console.log(`****** process resulted with\n`, htmlOUT);
    });

program.parse(process.argv);
```

Basically, you'll have HTML to process, the processing module along with options you specify to tailor the processing, and the resulting HTML.

This hasn't been tested, but a brief scan through the ExpressJS documentation says this could be incorporated as an output filter in a `res.render` callback function.  Normally such a callback is implemented as:

```js
res.render('index', function(err, html) {
  res.send(html);
});
```

But the _external-affiliate-link_ package could be integrated as so:

```js
res.render('index', function(err, html) {
  res.send(processor.process(html, {
      // options
  });
});
```

## The External/Affiliate Link package _options_ object

We've mentioned this options object a couple times now, but not said what it is.  Enough with the mystery?

As implied this is a simple anonymous object.  

The field `preferNofollow` says whether to start with the default of always applying `rel=nofollow`, or not applying it.  Some sites prefer to put `rel=nofollow` on all but a few outbound links, while others prefer to selectively use this setting.

The field `whitelist` is useful when `preferNoFollow` is true, and specifies a list of sites where `rel=nofollow` is not set.  For example

```js
const config_no_follow_all_whitelist_good = {
    preferNofollow: true,
    whitelist: [
        /somewhere.good$/i
    ]
};
```

Contrarily the field `blacklist` is useful when `preferNoFollow` is false, and this specifies a list of sites where `rel=nofollow` is to be set.  For example:

```js
const config_no_follow_none_blacklist_bad = {
    preferNofollow: false,
    blacklist: [
        /somewhere.bad$/i
    ]
};
```

Between those three settings we have quite a lot of flexibility in controlling which sites do or do not get `rel=nofollow`.  Notice that these are regular expressions on the domain name in the `hostname` field of the URL.

### Controlling target=_blank

Another option controls setting `target=_blank` on external links.  This is a blanket setting, whether to always use that behavior or not.  In any options object add this field:

```js
targetBlank: true
```

### Showing _favicons_ next to a link

Another option controls displaying the _favicon_ of the target site next to outbound links.  The _favicon_ is that little icon appearing in the URL location bar.  It is useful to add this as an indicator of an external link, and to help your viewer know where that link heads to.  In any options object add this field:

```js
showFavicons: "before",
```

The value can be _before_ or _after_ controlling whether the _favicon_ appears before the link or afterward.

Under the covers a little-known Google service is used to retrieve the _favicon_.

### Showing small image next to the link

Another option also informs the user that it is an external link, by showing a little blip of an image next to the link.  Like for the _showFavicons_ setting, it takes a value of _before_ or _after_.  In any options object add this field:

```js
showIcon: "after",
```

### Adding affiliate tags to outbound links

There are somewhere around a zillion websites offering affiliate programs.  We are offering here a software module to automatically add affiliate links, and obviously we cannot have covered all the zillion affiliate programs that are available.  Instead the package currently supports three programs, but it is easy to add others as desired.  Pull requests are gladly accepted.

In the options object we specify an array of objects in the `affiliateDomains` field.

```js
const config_amazon_com = {
    preferNofollow: false,
    targetBlank: true,
    showFavicons: "before",
    showIcon: "after",
    affiliateDomains: [
        {
            domain: "amazon.com",
            type: "AMAZON",
            trackingCode: "foobar-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.ca",
            type: "AMAZON",
            trackingCode: "foobar-ca-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.co.uk",
            type: "AMAZON",
            trackingCode: "foobar-co-uk-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.fr",
            type: "AMAZON",
            trackingCode: "foobar-fr-20",
            nofollow: true,
            noskim: true,
            novig: true
        },
        {
            domain: "amazon.de",
            type: "AMAZON",
            trackingCode: "foobar-de-20",
            nofollow: true,
            noskim: true,
            novig: false
        }
    ]
};
```

This is an example covering several Amazon sites.  Each Amazon operation in each country has traditionally had a separate affiliate program.

In each of these objects are several common fields:

* `domain` is a string to match against the `hostname` field of the URL.  It is an `endsWith` match, and therefore will match any hostname ending with the value in `domain`
* `type` specifies which kind of affiliate program it is.  We use this under the covers to apply specific transformations to the URL for the specific destination.  In this case `AMAZON` clearly means an Amazon affiliate program.
* `trackingCode` is the code assigned to your account by the affiliate program.
* `nofollow` specifies whether to set `rel=nofollow` on the link
* `noskim` and `novig` specify whether to set `rel=` values to inform Skimlinks or Viglinks to not rewrite the URL for their system


Zazzle is a marketplace allowing folks to design custom-made products by uploading images that Zazzle prints on to the product.  The Zazzle options object looks the same as the Amazon object, except that you put `zazzle.com` as the `domain`, and `ZAZZLE` as the `type`.

Rakuten operates a large network of affiliate programs where many thousands of merchants use Rakuten's services to manage their affiliate program.  Therefore we have a long list of potential affiliate partners available through site, and more importantly they all use the same rewriting strategy.  Their affiliate object looks a little different:

```js
{
    domain: "rakuten.foo",
    type: "RAKUTEN",
    trackingCode: "rakutenTrackingFoo",
    mid: "rakutenMIDfoo",
    nofollow: true,
    noskim: true,
    novig: true
}
```

Most of this is the same, other than `RAKUTEN` for the `type` and that new field labeled `mid`.  It is a value you get from Rakuten along with your `trackingCode`.

# But, wait, there's more

At the top I mentioned: _The methodology can be expanded to handle approximately a zillion other HTML DOM processing tasks._  Here's where we explain that sentence.

The `processor.process` method mentioned earlier is a simplification of using Mahabhuta to execute an array of Mahafuncs.  If you just went MahaWhata, let me explain.

Mahabhuta is a companion project to AkashaCMS.  Both Mahabhuta and Akasha are sanskrit words -- so far as I understand it, _Mahabhuta_ is the name for all the elements which make up the world, of which one is _Akasha_.  Ergo, Mahabhuta has to do with elements, and therefore in this context it refers to processing HTML elements.

Put another way, Mahabhuta is an engine for processing the HTML DOM in a Node.js program.  It relies on the Cheerio package, meaning that a programmer writing a Mahafunc is writing jQuery-like code to manipulate the DOM.

The word Mahafunc is probably another MahaWhat.  The programmer using Mahabhuta provides it an array of processing functions, each of which is called a Mahafunc (short for Mahabhuta Function).  Well, _array_ is too simple because it can handle arrays of arrays of arrays of functions.  Each Mahafunc is implemented with the jQuery-like API provided by Cheerio.

Inside `@mahabhuta/external-affiliate-links` is these functions:

```js
module.exports.process = async function(text, metadata, options) {
    let funcs = module.exports.mahabhutaArray(options);
    return await mahabhuta.processAsync(text, metadata, funcs);
};

module.exports.mahabhutaArray = function(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new ExternalLinkMunger());
    return ret;
};
```

In `mahabhutaArray` we construct a MahafuncArray -- an Array-like object to hold Mahafunc's -- containing the Mahafunc defined by the _ExternalLinkMunger_ class.  The _options_ object described earlier is passed into this function.  The _pluginName_ variable gives a human-readable name to the Array.

In `process` we see the MahabhutaArray being used in calling `mahabhuta.processAsync`.  The `text` object must be HTML, because inside Mahabhuta it will be handed to Cheerio which will throw errors if it is not HTML.  The `metadata` object can provide some data which can be accessed by Mahafunc's.  The `options` object is what we saw earlier, and is simply passed into the MahafuncArray constructor.

Maybe it's clear from this that a MahafuncArray is intended to hold a group of related Mahafunc's.  Each gets access to a common _options_ object, for example.

What's not shown here is that in addition to adding a Mahafunc to a MahafuncArray, you can also add a MahafuncArray.  As I said earlier, MahafuncArray's can be nested to any depth you like.

The `mahabhuta.processAsync` function executes each Mahafunc in order, stepping into each MahafuncArray as needed.

## Threaded Interpreted Languages

Back in 1983 I read an article in a computer science journal about _Threaded Interpreted Languages_.  This technique was used by the FORTH interpreter -- FORTH being an early interpreted programming language.  A FORTH program gets compiled down to byte codes, that are stored in an array, and the FORTH interpreter steps through the byte codes to execute the FORTH program.

In 1983 I wrote a BASIC interpreter using that technique.  The BASIC program was compiled down to a series of byte codes, and executed in an interpreter written in C.  With that program I got an A from the professor, and he later hired me to run some computer systems in the Computer Science department.

I mention this because Mahabhuta uses essentially the same model.  A MahafuncArray is an array of operations, each operation being described by a JavaScript class subclassing from Mahafunc.  The Mahafunc's are executed one by one, just like in a TIL implementation, and there are rules to cause re-execution of the Mahafunc's as needed.  For example if one Mahafunc inserts tags into the HTML which must be processed by another Mahafunc.

