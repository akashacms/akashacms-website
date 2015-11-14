var fs   = require('fs');
var path = require('path');

module.exports = {
    root_assets: [ 'assets' ],
    root_layouts: [ 'layouts' ],
    root_partials: [ 'partials' ],
    root_out: 'out',
    root_docs: [ 'documents'],
    
    root_url: 'http://akashacms.com',
    
    doMinimize: false,
    
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
    
    // editor: {
    // 	users: require('website-data').akashacmsCom.users
    // },
    
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
    
    headerScripts: {
        stylesheets: [
            { href: "/video.css", media: "screen" },
            { href: "/style.css", media: "screen" },
            { href: "/readable.min.css", media: "screen" }
        ],
        javaScriptTop: [
            { lang: "text/javascript",
              href: "https://ecommerce.shopintegrator.com/client/GetShopScript?CLIENT_ID=me0000151114" }
        ],
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
		
        akasha.emitter.on('done-render-files', function(cb) {
            // Generate .htaccess instructions for redirects from pages on wikidot
            // to the new pages
            // util.log('done-render-files received in Green Transportation .info');
            // var htappend = "\n\n";
            // for (var i = 0; i < module.exports.htaccess_append.length; i++) {
            //      var redir = module.exports.htaccess_append[i];
            //      htappend += 'RedirectMatch permanent '+ redir[0] +' '+ redir[1] +'\n';
            //  }
            // util.log('appending '+ htappend);
            fs.exists('htaccess-append.txt', function(exists) {
                if (exists) {
                    fs.readFile('htaccess-append.txt', function(err, htappend) {
                        if (err) cb(err);
                        else {
                            fs.appendFile(path.join(module.exports.root_out, ".htaccess"),
                                          htappend,
                                          'utf8',
                                          function(err) {
                                if (err) cb(err);
                                else cb();
                            });
                        }
                    });
                } else cb();
            });
        });
    },
    // For setting up redirects from pages on wikidot version of greentransportation.info
    htaccess_append: [
    	[ '^/partials.html', '/layout/partials.html' ],
    	[ '^/content.html', '/documents/index.html' ],
    	[ '^/templatechain.html', '/theming/index.html' ],
    	[ '^/layoutrecommendations.html', '/theming/index.html' ],
    	[ '^/deploy.html', '/deployment/index.html' ],
    	[ '^/asynchronous.html', '/layout/asynchronous-synchronous.html' ],
    	[ '^/config.html', '/configuration/index.html' ],
    	[ '^/extensions.html', '/configuration/ab-plugins.html' ],
    	[ '^/plugins/builtin.html', '/plugins/base.html' ],
    ]
};
