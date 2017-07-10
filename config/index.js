/**
 * Created by msoliman on 7/8/17.
 */

'use strict';

var path = require('path');
var _ = require('lodash');

//I ca n use it to validate later whether the variable is installed
function requiredProcessEnv(name) {
    if(!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }

    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,


    // Server port
    port: process.env.PORT || 3000,



    // Should we populate the DB with sample data?
    seedDB: false,


    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
            //,
            // server: {
            //     poolSize: 5
            // }

        }
    }


};

// Merge configs from this main file with environment specific configs
var environment = process.env.NODE_ENV || 'development';


module.exports = _.merge(
    all,
    require('./' + environment + '.js') || {});

