
var akasha = require('../../Node.js/akashacms');
var config = require('./config.js');
akasha.config(config);

// This is instead of the copyAssets function in akashacms.  It seems
// we can't put this config in the initConfig below because cwd can be only
// a single directory rather than an array of directories.
// Instead we create an array of config's, one for each root_assets entry

// TBD: Ensure the order of items is constructed correctly for the override
// behavior we want in AkashaCMS

var copyAssetsConfig = [];
for (var i = 0; i < config.root_assets.length; i++) {
    copyAssetsConfig.push({
        expand: true,
        cwd: config.root_assets[i],
        src: [ '**', '.htaccess' ],
        dest: config.root_out
    });
}

module.exports = function(grunt) {
        
    grunt.initConfig({
        akasha: akasha,
        config: config,
        
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: config.root_out,
                    src: '**/*.css',
                    dest: config.root_out
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                  removeComments: true,
                  collapseWhitespace: true
                },
                files: [{
                   expand: true,
                   cwd: config.root_out,
                   src: '**/*.html',
                   dest: config.root_out
                }]
            }
        },
        clean: [ config.root_out ],
        copy: {
            // Copy the contents of all root_assets directories into root_out
            assets: { files: copyAssetsConfig }
        },
        'sftp-deploy': {
            deploy: {
                auth: {
                    host: 'akashacms.com',
                    port: 22,
                    authKey: process.env.HOME +"/.sftp-deploy-akashacms.txt"
                },
                cache: 'sftpCache.json',
                src: config.root_out,
                dest: 't.akashacms.com',
                exclusions: [],
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        }
    });
    
    grunt.loadTasks('../../Node.js/akashacms/tasks');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sftp-deploy');
    
    // This is equivalent to akashacms build
    
    grunt.registerTask("build", [
        'emptyRootOut', 'copy:assets', // 'copyAssets',
        'gatherDocuments', // 'generateTagIndexes',
        'renderDocuments', 'eventDoneRender',
        'generateSitemap', 'allDone'
    ] );
    
    // This is equivalent to the old akashacms minify command that never worked and has been removed
    
    grunt.registerTask("optimize", [
        'cssmin', 'htmlmin'
    ]);
};
