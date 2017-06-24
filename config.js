
'use strict';

const util    = require('util');
const akasha  = require('akasharender');

const config = new akasha.Configuration();

config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    });

config
    .addLayoutsDir('layouts')
    .addPartialsDir('partials');

config
    .addDocumentsDir('documents')
    .addDocumentsDir({
        src: 'node_modules/akasharender/guide',
        dest: 'new/akasharender',
        baseMetadata: {
            bookHomeURL: "/new/akasharender/toc.html",
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/mahabhuta/guide',
        dest: 'new/mahabhuta',
        baseMetadata: {
            bookHomeURL: "/new/mahabhuta/toc.html",
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/epubtools/guide',
        dest: 'new/epubtools',
        baseMetadata: {
            bookHomeURL: "/new/epubtools/toc.html",
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-base/guide',
        dest: 'new/plugins/base',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akasharender/built-in-guide',
        dest: 'new/plugins/built-in',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-booknav/guide',
        dest: 'new/plugins/booknav',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-blog-podcast/guide',
        dest: 'new/plugins/blog-podcast',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-breadcrumbs/guide',
        dest: 'new/plugins/breadcrumbs',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-document-viewers/guide',
        dest: 'new/plugins/document-viewers',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-embeddables/guide',
        dest: 'new/plugins/embeddables',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-footnotes/guide',
        dest: 'new/plugins/footnotes',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-tagged-content/guide',
        dest: 'new/plugins/tagged-content',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-theme-bootstrap/guide',
        dest: 'new/plugins/theme-bootstrap',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-affiliates/guide',
        dest: 'new/plugins/affiliates',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-adblock-checker/guide',
        dest: 'new/plugins/adblock-checker',
        baseMetadata: {
            useNewSiteNavbar: true
        }
    });

config.rootURL("https://akashacms.com");

config
    .use(require('akashacms-theme-bootstrap'))
    .use(require('akashacms-base'))
    .use(require('akashacms-breadcrumbs'))
    .use(require('akashacms-booknav'))
    .use(require('akashacms-embeddables'))
    .use(require('akashacms-footnotes'))
    .use(require('akashacms-blog-podcast'))
    .use(require('akashacms-social-buttons'))
    .use(require('epub-website'));

config.plugin("akashacms-base").generateSitemap(config, true);

config
    .addFooterJavaScript({
        href: "/vendor/jquery/jquery.min.js"
    })
    .addFooterJavaScript({
        href: "/vendor/bootstrap/js/bootstrap.min.js"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap.min.css"
    })
    .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap-theme.min.css"
    })
    .addStylesheet({
        href: "/readable.min.css"
    })
    .addStylesheet({
        href: "/style.css"
    });

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

config.plugin('akashacms-blog-podcast')
    .addBlogPodcast(config, "news", {
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
    });

config.plugin('akashacms-blog-podcast')
    .addBlogPodcast(config, "howto", {
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
    });

// console.log('before prepare');
// console.log(util.inspect(config));

config.prepare();

module.exports = config;
