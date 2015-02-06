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
    
    deploy_rsync: {
        user: 'reikiman',
        host: 'akashacms.com',
        dir:  'akashacms.com'
    },
    
    tags: {
        pathIndexes: '/tags/',
        header: "---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p>Pages with tag @tagName@</p>"
    },
    
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
    
    googleAnalyticsAccount: "UA-37003917-1",
    googleAnalyticsDomain: "akashacms.com",
    // googleSiteVerification: "CcDz9XDUIb4D1cW8VuiGj3kI_hckLDPFuwMrM2tYBds",
    
    headerScripts: {
        stylesheets: [
            { href: "/video.css", media: "screen" },
            { href: "/style.css", media: "screen" },
            { href: "/readable.min.css", media: "screen" }
        ],
        javaScriptTop: [
            
        ],
        javaScriptBottom: [
            
        ]
    },
    
    funcs: {
    },

    cheerio: {
        recognizeSelfClosing: true,
        recognizeCDATA: true
    },
    
    config: function(akasha) {
		
		akasha.registerPlugins(module.exports, [
			{ name: 'akashacms-theme-bootstrap', plugin: require('akashacms-theme-bootstrap') },
			{ name: 'akashacms-breadcrumbs', plugin: require('akashacms-breadcrumbs') },
			{ name: 'akashacms-booknav', plugin: require('akashacms-booknav') },
			{ name: 'akashacms-embeddables', plugin: require('akashacms-embeddables') },
			{ name: 'akashacms-social-buttons', plugin: require('akashacms-social-buttons') },
			// { name: 'akashacms-tagged-content', plugin: require('akashacms-tagged-content') },
			{ name: 'akashacms-theme-boilerplate', plugin: require('akashacms-theme-boilerplate') }
		]);
		
        akasha.emitter.on('done-render-files', function() {
            // Generate .htaccess instructions for redirects from pages on wikidot
            // to the new pages
            // util.log('done-render-files received in Green Transportation .info');
            var htappend = "\n\n";
            for (var i = 0; i < module.exports.htaccess_append.length; i++) {
                var redir = module.exports.htaccess_append[i];
                htappend += 'RedirectMatch permanent '+ redir[0] +' '+ redir[1] +'\n';
            }
            // util.log('appending '+ htappend);
            fs.appendFileSync(path.join(module.exports.root_out, ".htaccess"), htappend, 'utf8');
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
    ]
};
