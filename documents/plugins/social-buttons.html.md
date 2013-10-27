---
layout: article.html.ejs
title: Buttons for various social networks (akashacms-social-buttons)
rightsidebar:
---

Making a website __shareable__ is a key part of modern online marketing strategies.  That is, we want to facilitate the natural tendancy for people finding a cool website to tell all their friends about it.  All the social networks provide code snippets we can embed in websites to enable sharing over to their network.

The `akashacms-social-buttons` plugin implements several of these services, and we are open to others being added.  Just issue a pull request on [the project](https://github.com/robogeek/akashacms-social-buttons).

Currently supported are:

* The ShareThis service
* Google+
* Twitter

# ShareThis

[ShareThis](http://sharethis.com) is one of the several services that have already incorporated buttons from all the social networks.  Each offers a customizable button bar with buttons of your choice.

Basic usage is something like this:

    <%- sharethisButtons({
      publisherID: "... your publisher ID",
      chiclets: [
        { className: "st_tumblr_large" },
        { className: "st_stumbleupon_large" },
        { className: "st_care2_large" },
        { className: "st_twitter_large" },
        { className: "st_facebook_large" },
        { className: "st_yahoo_large" },
        { className: "st_blogger_large" },
        { className: "st_sharethis_large" }
      ]
    }) %>

There is a lot of options, however, because the ShareThis is so comprehensive.  It may be instructive to refer to the [ShareThis customization instructions](http://support.sharethis.com/customer/portal/articles/464527-customize-appearance).

The `publisherID` is a required value.  To get one simply register for an account on [sharethis.com](http://sharethis.com) then click on the __account__ link at the top of the page.  The publisher ID string appears there.

## Chiclets

The list of allowable chiclet code names are on the [ShareThis website](http://support.sharethis.com/customer/portal/articles/446596-chicklets).  Note that the list of code names is just "facebook" etc, without the `st_` prefix or `_large` suffix.

Construct the chiclet names by first prefixing with `st_` then (optionally) adding one of these suffixes.

* `_large` for large buttons
* `_small` for smaller buttons
* `_custom` to use your own image - you must also specify the URL of the image

To configure the chiclets for your website, create an array of chiclet descriptor objects as shown above.  Each chiclet descriptor can have these attributes:

* `className` - As we already discussed, create the chiclet classname for the desired service
* `title` - Override the title for the shared content, for this chiclet only.  OPTIONAL, defaults to the page document title.
* `url` - Override the URL for the shared content, for this chiclet only.  OPTIONAL, defaults to the page URL.
* `displayText` - Override the description of the shared content, for this chiclet only.  OPTIONAL,
* `imageUrl` - Add a custom icon for the chiclet, if you have used the `_custom` tag in the `className`.  This is REQUIRED if you are using `_custom`

## Overriding the shared content

By default the ShareThus buttons do a good job of figuring out the content to share.  But they also let you configure each instance of the widget to share customized content if desired.  We already saw this while discussing chiclet configuration.

ShareThis will also consult OpenGraph data in the page as [documented on their site](http://support.sharethis.com/customer/portal/articles/475079-share-properties-and-sharing-custom-information).  AkashaCMS makes it easy to generate OpenGraph metadata using the [builtin plugin](builtin.html).

You can also customize the same parameters for the whole widget, not just for one of the chiclets.  To do so invoke the template function as so:

    <%- sharethisButtons({
      publisherID: "... your publisher ID",
      urlToShare: "... the URL for the shared content - OPTIONAL",
      titleToShare: "... the title for the shared content - OPTIONAL",
      imageToShare: "... the image URL to share in the shared content - OPTIONAL",
      summaryToShare: "... the description of the shared content - OPTIONAL",
      chiclets: [
         ... chiclets
      ]
    }) %>

## Overriding widget behavior and look

You can change some aspects of the default behavior as well.  It may be instructive to refer to [their documentation](http://support.sharethis.com/customer/portal/articles/500492-dynamic-buttons).

These options can also be added to the options object.

* `enableGoogleTracking` - If set to `true` then Google Analytics tracking is enabled.
* `disablePopularShares` - If set to `true` the "Popular Shares" screen is turned off.
* `disableHoverWidget` - If set to `true` the widget that pops up mouse hover is disabled.
* `headerTitle` - Adds the title to the ShareThis frame.
* `headerFGColor` - Sets the foreground color of the header in the ShareThis frame.
* `headerBGColor` - ditto for the background color

# Google+ simple button

Google+ has several sharing buttons, this is the simpler one.  ([documentation](https://developers.google.com/+/web/+1button/))

Simple use is simply:

    <%- googlePlusSimpleButton() %>

It uses the asynchronous javascript loading method.

* `dataSize` - Sets the button size to render - `small`, `medium`, `standard`, `tall`
* `dataAnnotation` - Sets the annotation to display next to the button. - `none`, `bubble`, `inline`
* `dataWidth` - When using the `inline` annotation style, sets the width of the box in pixels.
* `expandTo` - Sets the preferred positions to display hover and confirmation bubbles, which are relative to the button. 
* `dataCallback` - A callback function that is called (in the browser) after the user clicks the +1 button.
* `dataOnStartInteraction` - A callback function that is called either when a hover bubble displays, which is caused by the user hovering the mouse over the +1 button, or when a confirmation bubble displays, which is caused by the user +1'ing the page.
* `dataOnEndInteraction` - A callback function that is called when either a hover or confirmation bubble disappears.
* `dataRecommendations` - 


# Twitter

## Tweet button

[Twitters documentation for the Tweet button](https://twitter.com/about/resources/buttons#tweet)

Usage is as follows:

    <%- twitterShareButton() %>

* `dataSize` - Set to `large` for a large button
* `dataVia` -  Handle of twitter account
* `dataRelated` -  
* `dataHashtags` - Add hashtags

## Follow button

[Twitters documentation for the follow button](https://twitter.com/about/resources/buttons#follow)

Usage is as follows:

    <%- twitterFollowButton() %>

* `dataSize` - Set to `large` for a large button
* `dataShowCount` -  Show the follower count

# Reddit

This is just the simple Reddit button [documented on their site](http://www.reddit.com/buttons/).

Usage is as follows:

    <%- redditThisButton() %>

There are no options.

