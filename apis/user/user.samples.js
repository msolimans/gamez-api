/**
 * Created by msoliman on 7/9/17.
 */
var User = require("./user.model");
var config = require("../../config");

function generate(num) {

    if (config.seedDB) {
        User.generateSamples(num, function (err, users) {
            if (err)
                console.log("Error creating dummy data");
            else
                console.log("Faked users created");

        });
    }


}

module.exports = {
    generate: generate
};

