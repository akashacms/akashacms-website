

'use strict';

const util = require('util');
const akasha = require('../akasharender');

/////////// AkashaRender Guide

const configAkashaGuide = new akasha.Configuration();

configAkashaGuide
    .addLayoutsDir('layouts-ebook')
    .addDocumentsDir({
        src: '../akasharender-guide/documents',
        dest: 'akasharender-guide/'
    })
    .addPartialsDir('../akasharender-guide/partials')
    .addPartialsDir('partials');

configAkashaGuide
    .use(require('akashacms-theme-bootstrap'))
    .use(require('akashacms-base'))
    .use(require('akashacms-breadcrumbs'))
    .use(require('akashacms-booknav'));

configAkashaGuide
    .addFooterJavaScript({ href: "/vendor/jquery/jquery.min.js" })
    .addFooterJavaScript({ href: "/vendor/bootstrap/js/bootstrap.min.js" })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap.min.css" })
    .addStylesheet({       href: "/vendor/bootstrap/css/bootstrap-theme.min.css"  })
    .addStylesheet({       href: "/readable.min.css"  })
    .addStylesheet({       href: "/style.css"  });

configAkashaGuide.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true
});

configAkashaGuide.prepare();

module.exports = configAkashaGuide;
