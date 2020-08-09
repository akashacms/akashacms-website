---
layout: blog.html.njk
title: How to add a free shopping cart and sell products on an AkashaCMS website
publicationDate: November 13, 2015
blogtag: news
teaser: Supposedly selling products via a website and having a shopping shopping cart requires a dynamically generated website using a content management system.  But, there are online store services which can be added to any website, even ones built as static HTML files.
---

Recently I was checking into ways to sell digital downloads through a Wordpress site, and there are several Wordpress plugins for that purpose.  But while looking at tutorial videos I found one for ShopIntegrator.  It's an easy-to-use shopping cart product sales system that supports selling digital downloads like electronic books.  But, an interesting feature of ShopIntegrator is it can be integrated into any website just by pasting HTML snippets into the website code.

That caught my attention.  Just like an AkashaCMS website can support commenting by embedding the Disqus, an AkashaCMS website can embed any service.  That means adding product sales and a shopping cart is a simple manager of adding the ShopIntegrator HTML snippets into the config for your site.

As of this writing it has been done on this very site to sell the AkashaEPUB book.  The integration was easy, and took about five minutes.

While logged into the ShopIntegrator Admin dashboard, click on the "Add To Website" button.  You'll be taken to a long webpage with several options on how the store will be integrated into your website.

For AkashaCMS select "Any Web Page (HTML)" as the type of website.  They have plugins for a bunch of different content management systems, but this option is what gives you HTML snippets.

There are a number of options on the kind of store to set up.  Customize those to your liking.  For the AkashaEPUB product, I selected "Sell Single Product" then chose the button layout which takes the person directly to the shopping cart checkout.  Their system is flexible enough to be used many different ways.

At the bottom of this page are two boxes, and some instructions.  One box contains code to be added to the `<HEAD>` section.  For an AkashaCMS website, you'll need to interpolate this code to a setting in `config.js` - this is taken from the config for this site:


    headerScripts: {
        stylesheets: [
            { href: "/video.css", media: "screen" },
            { href: "/style.css", media: "screen" },
            { href: "/readable.min.css", media: "screen" }
        ],
        javaScriptTop: [
            { lang: "text/javascript",
              href: "https://ecommerce.shopintegrator.com/client/GetShopScript?CLIENT_ID= ... YOUR CUSTOMER ID ..." }
        ],
        javaScriptBottom: [ ]
    },

That JavaScript initializes the ShopIntegrator system on your site.  The next snippet shows the "Ecommerce Plugin" at the chosen location on your site.

For this site I wanted a simple button in the sidebar.  The `header-footer.html.ejs` layout template is where this is controlled.  I simply pasted the code directly into that template.

That's it - two places to add code, then the product is in the sidebar.

Suppose you have multiple products, or want to have a full product description on a page.  Simply make a different choice in "Choose How To Display The Product On Your Website" and paste the resulting code into the page.

UPDATE: I have since removed the ShopIntegrator code from this site because their service is down today.  That makes this particular service unreliable, and therefore I don't want it on the site.  The advice is still valuable and shows not just integration of ShopIntegrator but other 3rd party services.
