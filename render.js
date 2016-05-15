
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

config
    .use(require('akashacms-base'))
    .use(require('akashacms-breadcrumbs'))
    .use(require('../akashacms-booknav'))
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

