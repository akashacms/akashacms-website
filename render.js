
'use strict';

const akasha = require('../akasharender');

/////////// AkashaRender Guide

const configAkashaGuide = require('./config-guide');

akasha.render(configAkashaGuide)
.then(results => {
    for (let result of results) {
        if (result.error) {
            console.error(result.error);
        } else {
            console.log(result.result);
        }
    }
})
.catch(err => { console.error(err); })

.then(() => {
    
    ///////////// AkashaRender/AkashaCMS Website
    
    const config = require('./config');
    
    return config.copyAssets()
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

})
.catch(err => { console.error(err); });
