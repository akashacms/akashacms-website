
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
        host: 'rules4humans.com',
        dir:  'akashacms.com'
    },
    
    plugins: [
        'akashacms-breadcrumbs',
        'akashacms-booknav',
        'akashacms-embeddables',
        'akashacms-social-buttons',
        'akashacms-tagged-content',
        'akashacms-theme-bootstrap'
    ],
    
    tags: {
        pathIndexes: '/tags/',
        header: "---\ntitle: @title@\nlayout: tagpage.html.ejs\n---\n<p>Pages with tag @tagName@</p>"
    },
    
    data: {
        googleAnalyticsAccount: "UA-37003917-1",
        googleAnalyticsDomain: "akashacms.com",
        // googleSiteVerification: "CcDz9XDUIb4D1cW8VuiGj3kI_hckLDPFuwMrM2tYBds",
        metarobots: "index,follow",
        metaOGtype: "website",
        metaOGsite_name: "AkashaCMS",
        metasubject: "Content Management Systems",
        metalanguage: "EN",
        headerScripts: {
            stylesheets: [
                { href: "/video.css", media: "screen" },
                { href: "/style.css", media: "screen" }
            ],
            javaScriptTop: [
                
            ],
            javaScriptBottom: [
                
            ]
        }
    },
    funcs: {
    }
}
