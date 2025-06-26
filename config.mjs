
'use strict';

import util from 'node:util';
import akasha from 'akasharender';

// import { AffiliatesPlugin } from '../index.mjs';
import { ThemeBootstrapPlugin } from '@akashacms/theme-bootstrap';
import { BasePlugin } from '@akashacms/plugins-base';
import { BreadcrumbsPlugin } from '@akashacms/plugins-breadcrumbs';
import { BooknavPlugin } from '@akashacms/plugins-booknav';
import { EmbeddablesPlugin } from '@akashacms/plugins-embeddables';
import { BlogPodcastPlugin } from '@akashacms/plugins-blog-podcast';
// import { TaggedContentPlugin } from '@akashacms/plugins-tagged-content';

import { AuthorsPlugin } from '@akashacms/plugins-authors';
// import { DownloadAssetsPlugin } from '@akashacms/plugins-dlassets';
import { DocumentViewersPlugin } from '@akashacms/plugins-document-viewers';
import { ExternalLinksPlugin } from '@akashacms/plugins-external-links';
import { FootnotesPlugin } from '@akashacms/plugins-footnotes';

import { default as EPUBWebsitePlugin } from 'epub-website/index.mjs';

import { default as MarkdownITPlantUML } from 'markdown-it-plantuml';
import { default as MarkdownITHighlight } from 'markdown-it-highlightjs';

const __dirname = import.meta.dirname;

const config = new akasha.Configuration();

config.findRendererName('.html.md')
    .configuration({
        html:         true,
        xhtmlOut:     false,
        breaks:       false,
        linkify:      true,
        typographer:  false,
    })
    .use(MarkdownITPlantUML, {
        imageFormat: 'svg'
    })
    .use(MarkdownITHighlight, { 
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

// This group of directory mounts brings the documentation
// from the plugins into the virtual filesystem.
//
// In the past we tried two methods:
//   1. Use git submodules to bring in packages, but that
//      proved to be too complex.
//   2. Put the documentation into the package, but that
//      increases the package size with no benefit.
//
// This approach requires all plugin repositories to be
// checked out in sibling directories.
config
    .addDocumentsDir('documents')
    .addDocumentsDir({
        src: '../akasharender/guide',
        dest: 'akasharender',
        baseMetadata: {
            bookHomeURL: "/akasharender/toc.html"
        }
    })
    .addDocumentsDir({
        src: '../mahabhuta/guide',
        dest: 'mahabhuta',
        baseMetadata: {
            bookHomeURL: "/mahabhuta/toc.html"
        }
    })
    .addDocumentsDir({
        src: '../epub-guide/documents',
        dest: 'epubtools',
        baseMetadata: {
            bookHomeURL: "/epubtools/toc.html"
        }
    })
    .addDocumentsDir({
        src: '../akashacms-base/guide',
        dest: 'plugins/base'
    })
    .addDocumentsDir({
        src: '../akasharender/built-in-guide',
        dest: 'plugins/built-in'
    })
    .addDocumentsDir({
        src: '../akashacms-plugin-authors/guide',
        dest: 'plugins/authors'
    })
    .addDocumentsDir({
        src: '../akashacms-booknav/guide',
        dest: 'plugins/booknav'
    })
    .addDocumentsDir({
        src: '../akashacms-blog-podcast/guide',
        dest: 'plugins/blog-podcast'
    })
    .addDocumentsDir({
        src: '../akashacms-breadcrumbs/guide',
        dest: 'plugins/breadcrumbs'
    })
    .addDocumentsDir({
        src: '../akashacms-document-viewers/guide',
        dest: 'plugins/document-viewers'
    })
    .addDocumentsDir({
        src: '../akashacms-embeddables/guide',
        dest: 'plugins/embeddables'
    })
    .addDocumentsDir({
        src: '../akashacms-external-links/guide',
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
        src: '../akashacms-footnotes/guide',
        dest: 'plugins/footnotes'
    })
    .addDocumentsDir({
        src: '../akashacms-tagged-content/guide',
        dest: 'plugins/tagged-content'
    })
    .addDocumentsDir({
        src: '../akashacms-theme-bootstrap/guide',
        dest: 'plugins/theme-bootstrap'
    })
    .addDocumentsDir({
        src: '../akashacms-affiliates/guide',
        dest: 'plugins/affiliates'
    })
    .addDocumentsDir({
        src: '../akasharender-epub/guide',
        dest: 'plugins/akasharender-epub'
    })
    .addDocumentsDir({
        src: '../akashacms-adblock-checker/guide',
        dest: 'plugins/adblock-checker'
    });

config.rootURL("https://akashacms.com");

config
    .use(ThemeBootstrapPlugin)
    .use(BasePlugin, {
        generateSitemapFlag: true
    })
    .use(BreadcrumbsPlugin)
    .use(BooknavPlugin)
    .use(EmbeddablesPlugin)
    .use(ExternalLinksPlugin)
    .use(FootnotesPlugin)
    .use(AuthorsPlugin, {
        default: 'david',
        authors: [
            {
                code: 'david',
                fullname: 'David Herron',
                url: '/about.html'
            }
        ]
    })
    .use(BlogPodcastPlugin, {
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
                matchers: {
                    layouts: [ "blog.html.ejs", "blog.html.liquid", "blog.html.njk" ],
                    rootPath: 'news/'
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
                matchers: {
                    layouts: [ "blog.html.ejs", "blog.html.liquid", "blog.html.njk" ],
                    rootPath: 'howto/'
                }
            }
        }
    })
    .use(EPUBWebsitePlugin)
    ;

config.plugin("@akashacms/plugins-external-links")
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

export default config;
