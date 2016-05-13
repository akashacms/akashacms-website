var fs   = require('fs');
var path = require('path');

var akashacms = require('akashacms');

module.exports = akashacms.prepareConfig({
    
    root_url: 'http://akashacms.com',
    
    authorship: {
    	defaultAuthorName: "david",
    	authors: [
			{
				name: "david",
				fullname: "David Herron",
				authorship: "https://plus.google.com/+DavidHerron/about",
			}
    	]
    },
    
    data: {
        metarobots: "index,follow",
        metaOGtype: "website",
        metaOGsite_name: "AkashaCMS",
        metasubject: "Content Management Systems",
        metalanguage: "EN",
    },
    
	google: {
		analyticsAccount: "UA-37003917-1",
		analyticsDomain: "akashacms.com",
		// siteVerification: "CcDz9XDUIb4D1cW8VuiGj3kI_hckLDPFuwMrM2tYBds",
	},
	
	akBase: {
	    linkRelTags: [
	        { relationship: "me", url: "https://twitter.com/akashacms" }
	    ]
	},
    
    headerScripts: {
        stylesheets: [
            { href: "/video.css", media: "screen" },
            { href: "/style.css", media: "screen" },
            { href: "/readable.min.css", media: "screen" }
        ],
        javaScriptTop: [ ],
        javaScriptBottom: [ ]
    },
	
	blogPodcast: {
		"news": {
			rss: {
				title: "AkashaCMS News",
				description: "Announcements and news about the AkashaCMS content management system",
				site_url: "http://akashacms.com/news/index.html",
				image_url: "http://akashacms.com/logo.gif",
				managingEditor: 'David Herron',
				webMaster: 'David Herron',
				copyright: '2015 David Herron',
				language: 'en',
				categories: [ "Node.js", "Content Management System", "HTML5", "Static website generator" ]
			},
			rssurl: "/news/rss.xml",
            rootPath: "news",
			matchers: {
				layouts: [ "blog.html.ejs" ],
				path: /^news\//
			}
		},
		
		"howto": {
			rss: {
				title: "AkashaCMS Tutorials",
				description: "Tutorials about using the AkashaCMS content management system",
				site_url: "http://akashacms.com/howto/index.html",
				image_url: "http://akashacms.com/logo.gif",
				managingEditor: 'David Herron',
				webMaster: 'David Herron',
				copyright: '2015 David Herron',
				language: 'en',
				categories: [ "Node.js", "Content Management System", "HTML5", "HTML5", "Static website generator" ]
			},
			rssurl: "/howto/rss.xml",
            rootPath: "howto",
			matchers: {
				layouts: [ "blog.html.ejs" ],
				path: /^howto\//
			}
		}
	},
    
    funcs: {
    },

    cheerio: {
        recognizeSelfClosing: true,
        recognizeCDATA: true
    },
    
	themeBootstrap: {
		bootstrapCSSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css",
		bootstrapThemeCSSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css",
		bootstrapJSurl: "//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js",
		useHtml5shiv: true,
		useRespondJS: true
	},
	
    config: function(akasha) {
		akasha.registerPlugins([
			{ name: 'akashacms-theme-bootstrap', plugin: require('akashacms-theme-bootstrap') },
			{ name: 'akashacms-breadcrumbs', plugin: require('akashacms-breadcrumbs') },
			{ name: 'akashacms-booknav', plugin: require('akashacms-booknav') },
			{ name: 'akashacms-embeddables', plugin: require('akashacms-embeddables') },
			{ name: 'akashacms-blog-podcast', plugin: require('akashacms-blog-podcast') },
			{ name: 'akashacms-social-buttons', plugin: require('akashacms-social-buttons') },
			// { name: 'akashacms-tagged-content', plugin: require('akashacms-tagged-content') }
			{ name: 'akashacms-base', plugin: require('akashacms-base') }
		]);
    }
});

