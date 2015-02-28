
var akasha = require('../../Node.js/akashacms');
var config = require('./config.js');
akasha.config(config);

module.exports = function(grunt) {
    
    // tasks: copyAssets, buildepub, buildweb
    
    grunt.initConfig({
        akasha: akasha,
        config: config
    });
    
    grunt.loadTasks('../../Node.js/akashacms/tasks');
    
    grunt.registerTask("build", [
        'emptyRootOut', 'copyAssets',
        'gatherDocuments', // 'generateTagIndexes',
        'renderDocuments', 'eventDoneRender',
        'generateSitemap', 'allDone'
    ] );
};
