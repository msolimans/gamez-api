/**
 * Created by msoliman on 7/9/17.
 */

'use strict';

// Development specific configuration
// ==================================
module.exports = {
    // MongoDB connection options

    port: process.env.PORT || 3000,
    mongo: {
        // uri: "mongodb://admin:admin@ds143221.mlab.com:43221/wbagora"
        uri: "mongodb://admin:admin@ds143221.mlab.com:43221/wbagora"
    },

    seedDB: false
};
