
'use strict';

const util    = require('util');
const akasha  = require('akasharender');

const config = new akasha.Configuration();

config.findRendererName('.html.md')
    .use(require('markdown-it-plantuml'), {
        imageFormat: 'svg'
    })
    .use(require('markdown-it-highlightjs'), { 
        auto: true, 
        code: true 
    });

config
    .addAssetsDir('assets')
    .addAssetsDir({
        src: 'node_modules/bootstrap/dist',
        dest: 'vendor/bootstrap'
    })
   .addAssetsDir({
        src: 'node_modules/jquery/dist',
        dest: 'vendor/jquery'
    })
    .addAssetsDir({
        src: 'node_modules/popper.js/dist',
        dest: 'vendor/popper.js'
    })
    // The purpose of the following mount is to solve this error:
    //
    // (node:75702) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 953)
    // (node:75702) UnhandledPromiseRejectionWarning: Error: No mountPoint found for node_modules/@fortawesome/fontawesome-free/svgs/solid/school.svg
    //    at DirsWatcher.fileInfo (file:///Volumes/Extra/akasharender/akashacms-website/node_modules/akasharender/watcher/watcher.mjs:49:19)
    // .addAssetsDir({
    //    src: 'node_modules/@fortawesome/fontawesome-free/',
    //    dest: 'node_modules/@fortawesome/fontawesome-free'
    // })
    .addAssetsDir({
        src: 'node_modules/@fortawesome/fontawesome-free',
        dest: 'vendor/fontawesome-free'
    })
    .addAssetsDir({ 
        src: 'node_modules/highlight.js', 
        dest: 'vendor/highlight.js' 
    })
    // Likewise, the following is to fix this error:
    //
    // node:75846) UnhandledPromiseRejectionWarning: Error: No mountPoint found for node_modules/highlight.js/scss/kimbie.dark.scss
    //    at DirsWatcher.fileInfo (file:///Volumes/Extra/akasharender/akashacms-website/node_modules/akasharender/watcher/watcher.mjs:49:19)
    // .addAssetsDir({ 
    //    src: 'node_modules/highlight.js/', 
    //    dest: 'node_modules/highlight.js' 
    // })
    // 
    // Actually - the error was that there was a trailing '/' on the
    // "src" paths in these instances.  That caused something to go wrong.
    //
    .addAssetsDir({
        src: 'node_modules/bootstrap-icons/icons',
        dest: 'vendor/bootstrap-icons'
    })
    .addAssetsDir({
        src: 'node_modules/gridjs/dist',
        dest: 'vendor/gridjs'
    });

config
    .addLayoutsDir('layouts')
    .addPartialsDir('partials');

config
    .addDocumentsDir('documents')
    .addDocumentsDir({
        src: 'node_modules/akasharender/guide',
        dest: 'akasharender',
        baseMetadata: {
            bookHomeURL: "/akasharender/toc.html"
        }
    })
    .addDocumentsDir({
        src: 'modules/mahabhuta/guide',
        dest: 'mahabhuta',
        baseMetadata: {
            bookHomeURL: "/mahabhuta/toc.html"
        }
    })
    .addDocumentsDir({
        src: 'node_modules/epub-guide/documents',
        dest: 'epubtools',
        baseMetadata: {
            bookHomeURL: "/epubtools/toc.html"
        }
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-base/guide',
        dest: 'plugins/base'
    })
    .addDocumentsDir({
        src: 'node_modules/akasharender/built-in-guide',
        dest: 'plugins/built-in'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-authors/guide',
        dest: 'plugins/authors'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-booknav/guide',
        dest: 'plugins/booknav'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-blog-podcast/guide',
        dest: 'plugins/blog-podcast'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-breadcrumbs/guide',
        dest: 'plugins/breadcrumbs'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-document-viewers/guide',
        dest: 'plugins/document-viewers'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-embeddables/guide',
        dest: 'plugins/embeddables'
    })
    .addDocumentsDir({
        src: 'modules/akashacms-external-links/guide',
        dest: 'plugins/external-links'
    })
    /* TODO .addDocumentsDir({
        src: 'node_modules/akashacms-external-links/guide-akashacms',
        dest: 'plugins/external-links'
    })
    TODO for this we need a section for Mahabhuta plugins
         so the navbar needs Plugs/AkashaCMS and Plugins/Mahabhuta
    .addDocumentsDir({
        src: 'node_modules/akashacms-external-links/guide-mahabhuta',
        dest: 'plugins-mahabhuta/external-links'
    }) */
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-footnotes/guide',
        dest: 'plugins/footnotes'
    })
    .addDocumentsDir({
        src: 'node_modules/@akashacms/plugins-tagged-content/guide',
        dest: 'plugins/tagged-content'
    })
    .addDocumentsDir({
        src: 'modules/akashacms-theme-bootstrap/guide',
        dest: 'plugins/theme-bootstrap'
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-affiliates/guide',
        dest: 'plugins/affiliates'
    })
    .addDocumentsDir({
        src: 'node_modules/akasharender-epub/guide',
        dest: 'plugins/akasharender-epub'
    })
    .addDocumentsDir({
        src: 'node_modules/akashacms-adblock-checker/guide',
        dest: 'plugins/adblock-checker'
    });

config.rootURL("https://akashacms.com");

config
    .use(require('@akashacms/theme-bootstrap'))
    .use(require('@akashacms/plugins-base'), {
        generateSitemapFlag: true
    })
    .use(require('@akashacms/plugins-breadcrumbs'))
    .use(require('@akashacms/plugins-booknav'))
    .use(require('@akashacms/plugins-embeddables'))
    .use(require('@akashacms/plugin-external-links'))
    .use(require('@akashacms/plugins-footnotes'))
    .use(require('@akashacms/plugins-authors'), {
        default: 'david',
        authors: [
            {
                code: 'david',
                fullname: 'David Herron',
                url: '/about.html'
            }
        ]
    })
    .use(require('@akashacms/plugins-blog-podcast'), {
        bloglist: {
            news: {
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
                    layouts: [ "blog.html.ejs", "blog.html.liquid", "blog.html.njk" ],
                    path: /^news\//
                }
            },
            howto: {
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
                    layouts: [ "blog.html.ejs", "blog.html.liquid", "blog.html.njk" ],
                    path: /^howto\//
                }
            }
        }
    })
    .use(require('epub-website'));

config.plugin("@akashacms/plugin-external-links")
    .setTargetBlank(config, true)
    .setShowFavicons(config, "before");

config
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/popper.js/umd/popper.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
    // .addFooterJavaScript({ href: "/vendor/highlight.js/lib/highlight.js" })
    // .addFooterJavaScript({ script: 'hljs.initHighlightingOnLoad();' })
    // .addFooterJavaScript({
    //    script: `
    //    document.addEventListener('DOMContentLoaded', (event) => {
    //        document.querySelectorAll('pre code').forEach((block) => {
    //          hljs.highlightBlock(block);
    //        });
    //    });
    //    `})
    .addStylesheet({ href: "/vendor/bootstrap/css/bootstrap.min.css" })
    /* .addStylesheet({
        href: "/vendor/bootstrap/css/bootstrap-theme.min.css"
    }) */
    .addStylesheet({ href: "/pulse.min.css" })
    .addStylesheet({ href: "/style.css" })
    .addStylesheet({ href: "/vendor/fontawesome-free/css/all.min.css" })
    .addStylesheet({ href: "/vendor/highlight.js/styles/shades-of-purple.css" });
    // .addStylesheet({ href: "/vendor/highlight.js/styles/github-dark-dimmed.css" });
    // .addStylesheet({ href: "/vendor/highlight.js/styles/tomorrow-night-blue.css" });
    // .addStylesheet({ href: "/vendor/highlight.js/styles/atelier-cave-light.css" });

config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

// console.log('before prepare');
// console.log(util.inspect(config));

config.prepare();

module.exports = config;
