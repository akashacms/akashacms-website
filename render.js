
'use strict';

const util = require('util');
var akasha = require('../akasharender');
var config = new akasha.Configuration();

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
    .use(require('../akashacms-base-render'))
    .use(require('../akashacms-breadcrumbs-render'))
    .use(require('../akashacms-booknav-render'))
    .use(require('../akashacms-embeddables-render'))
    .use(require('../akashacms-blog-podcast-render'))
    .use(require('../akashacms-social-buttons-render'));

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

