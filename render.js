
'use strict';

const util = require('util');
const akasha = require('akasharender');
const config = new akasha.Configuration();

config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'bower_components/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'bower_components/jquery/dist',
        dest: 'vendor/jquery'
    });

config
    .addLayoutsDir('layouts')
    .addDocumentsDir('documents')
    .addPartialsDir('partials');

config.rootURL("http://akashacms.com");

config
    .use(require('akashacms-base'))
    .use(require('akashacms-breadcrumbs'))
    .use(require('akashacms-booknav'))
    .use(require('akashacms-embeddables'))
    .use(require('akashacms-blog-podcast'))
    .use(require('akashacms-social-buttons'));

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

console.log('before prepare');
// console.log(util.inspect(config));

config.prepare();
config.copyAssets()
.then(() => {
    return akasha.render(config)
        .then(results => {
            for (let result of results) {
                if (result.error) {
                    console.error(result.error);
                } else {
                    console.log(result.result);
                }
            }
        });
})
.catch(err => { console.error(err); });
