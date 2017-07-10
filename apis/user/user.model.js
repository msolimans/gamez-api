/**
 * Created by msoliman on 7/7/17.
 */


var async = require("async");
var faker = require("faker");
//In case we need different localities
//var faker = require('faker/locale/de');
var mongoose = require("mongoose");
var validate = require("mongoose-validator");

//validating names to have only characters (I applied to firstName only)
var nameValidator = [
    validate({
        validator: "matches",
        arguments: "^[a-zA-Z]+$",
        message: "Must be only characters!"
    })
];

//validating emails
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var AwardsList = ['A', 'B', 'C', 'D'];


//User Schema - Holds all information regarding User - Schema should be designed according to access patterns or scenarios
// Because of the lack of requirements and as per my understanding I mix personal info. and achievements with addition to current match
var UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: {unique: true},
        minlength: 3,
        maxLength: 20,
        lowercase: true},
    email: {
        type: String,
        required: true,
        index: {unique: true},
        maxLength: 20,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password: String,
    //all other fields should have validations too (according to requirements)
    firstName: {type: String, validate: nameValidator} ,
    lastName: String,
    birthDate: Date,
    streetAddress: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    rank: {type: Number},//should be calculated based on stats
    //stats in the same table in case of the need to retrieve all info
    //we can separate also stats in case we need to get the top players
    kills: Number,
    deaths: Number,
    wins: Number,
    losses: Number,
    currentMatch: {type: mongoose.Schema.Types.ObjectId, ref: "Matches"},
    myMatches: [{type: mongoose.Schema.Types.ObjectId, ref: "Matches"}],
    //Awards saved here as I supposed it is a small set (few items)
    awards: [{
        issueDate: {type: Date, default: Date.now()},
        type: {type: String, enum: AwardsList, trim: true}
    }]
});


//Indexing

//Compound Key: using both userName and password => Enhance queries using (Both of them or using only userName as it's "the prefix" of the partition key)
//Support logins using userName/pass
UserSchema.index({userName: 1, password: 1});
//Compound Key: using both email and password => Enhance queries using (Both of them or using only email as it's "the prefix" of the partition key)
//Support logins using email/pass
UserSchema.index({email: 1, password: 1});

//Supports and Enhances Top N ranks queries
UserSchema.index({rank: 1});


//faker to seed database with samples of data (it is not complete though but just I added as a proof of knowledge)
UserSchema.statistics = {
    generateSamples: function(sampleSize, callBack){
        var self = this;


        async.times(sampleSize, function(n, next){
            var userName = faker.helpers.slugify(faker.internet.userName()).replace(/\./g,'').substring(0,15);

            var from = new Date(1990, 1, 1, 12, 0, 0, 0);
            var to = new Date(2000, 1, 1, 12, 0, 0, 0);


            new self({
                userName: userName,
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                birthDate: faker.date.between(from, to),
                streetAddress: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zipCode: faker.address.zipCode(),
                country: faker.address.country(),
                wins: faker.random.number(),
                losses: faker.random.number(),
                kills: faker.random.number(),
                deaths: faker.random.number()
            }).save(function(err, contact){
                next(err, contact);
            });
        }, callBack);

    }
};


module.exports = mongoose.model('Users', UserSchema);
