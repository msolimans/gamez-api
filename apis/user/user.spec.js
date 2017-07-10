/**
 * Created by msoliman on 7/9/17.
 */
"use strict";

var should = require("should");
var app = require("../../app");
var request = require("supertest");
var User = require("./user.model");

//we can generate a sample
var user = new User({

    userName: "FakerUser",
    email: "test@test.com"


});


describe("User Model", function () {
    before(function (done) {
        // Clear users before testing
        User.remove().exec().then(function () {
            done();
        });
    });

    afterEach(function (done) {
        User.remove().exec().then(function () {
            done();
        });
    });

    it("should begin with no users", function (done) {
        User.find({}, function (err, users) {
            users.should.have.length(0);
            done();
        });
    });

    it("should fail when saving a duplicate user", function (done) {

        //should have err in case of duplicate users
        user.save(function () {
            var userDup = new User(user);
            userDup.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    it("should fail when saving without an email", function (done) {
        user.email = "";
        user.save(function (err) {
            should.exist(err);
            done();
        });
    });


    it("should respond with JSON array", function (done) {
        request(app)
            .get("/api/users")
            .expect(200)
            .expect("Content-Type", /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                done();
            });
    })

});





