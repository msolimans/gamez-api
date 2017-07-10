/**
 * Created by msoliman on 7/9/17.
 */

'use strict';

// Production specific configuration
// =================================
module.exports = {
    // Server IP
    //ip:  process.env.IP  || '0.0.0.0',

    // Server port
    port: process.env.PORT || 3000,

    // MongoDB connection options
    mongo: {
        uri:    process.env.OPENSHIFT_MONGODB_DB_URL ||
            "mongodb://admin:admin@ds143221.mlab.com:43221/wbagora"
    }


};
