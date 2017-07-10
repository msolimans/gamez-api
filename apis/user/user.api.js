/**
 * Created by msoliman on 7/9/17.
 */
/**
 * Created by msoliman on 7/8/17.
 */


var User = require("./user.model");

var Match = require("../match/match.model");

var httpUtils = require("../httpUtils");

var _ = require("lodash");


function addDetails(req, user) {
    user.stats = httpUtils.getAbsUrl(req) + "/users/stats/" + user._id;


    if (user.currentMatch)
        user.currentMatch = httpUtils.getAbsUrl(req) + "/matches/" + user.currentMatch._id;
}

var zeroStats = {
    kills: 0,
    deaths: 0,
    wins: 0,
    losses: 0
};

var personInfoFields = "_id userName email firstName lastName birthDate streetAddress city state zipCode country currentMatch";


var self = module.exports = {
    //should not been exported (it should be restructured NOT to export it)
    get: function(req, res, criteria, fields){
        if(!fields)
            fields = '';

        if(!criteria)
            criteria = {};

        User.find(criteria).select(fields).lean().exec(function (err, users) {
            if (err)
                return httpUtils.handleError(res, err);


            if(!users)
                return httpUtils.sendNotFound();

            users.forEach(function (user) {
                addDetails(req, user);

            });


            return res.json(users);


        });
    },
    //achievments, awards, and personInfo
    getAllFullProfiles: function(req, res){
        return self.get(req, res);
    },

    //get all users
    getAllPersonalInfos: function (req, res) {
        return self.get(req, res, {}, personInfoFields);
    },
    // //get specific user - GET /api/users/10
    // get: function (req, res, fields) {
    //     var userId = req.body.id || req.params.id || req.headers["x-user-id"];
    //
    //
    //     User.findById(userId).select(fields).exec(function (err, user) {
    //         if (err)
    //             return httpUtils.handleError(res, err);
    //
    //
    //         if (!user)
    //             return httpUtils.sendNotFound("User Not Found");
    //
    //         user = user.toObject();
    //
    //         addDetails(req, user);
    //
    //         return res.json(user);
    //
    //     });
    //
    // },

    getPersonalInfo: function(req, res){
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];
        return self.get(req, res, {_id: userId}, personInfoFields);
    },
    getFullProfile: function(req, res){
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];
        return self.get(req, res, {_id: userId});
    },
    //create user
    create: function (req, res) {
        var user = new User();
        user.userName = req.body.userName;
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.birthDate = req.body.birthDate;
        user.streetAddress = req.body.streetAddress;
        user.city = req.body.city;
        user.state = req.body.state;
        user.zipCode = req.body.zipCode;
        user.country = req.body.country;


        user.save(function (err) {
            if (err) {
                return res.json({success: false, err: err});
            }

            //201 status for new objects!
            return res.status(201).json({
                success: true,
                message: 'User has been created',
                //HATEOS
                url: httpUtils.getAbsUrl(req) + "/users/" + user._id
            });
        });


    },


    //update user data - PUT  /api/users/10
    update: function (req, res) {

        var userId = req.body.id || req.params.id || req.headers["x-user-id"];

        User.findById(userId, function (err, user) {

            if (err)
                return httpUtils.handleError(res, err);

            if (!user)
                return httpUtils.sendNotFound("User Not Found");

            // user.userName = req.body.userName || user.userName;
            // user.email = req.body.email || user.email;
            // user.firstName = req.body.firstName || user.firstName;
            // user.lastName = req.body.lastName || user.lastName;
            // user.birthDate = req.body.birthDate || user.birthDate;
            // user.streetAddress = req.body.streetAddress || user.streetAddress;
            // user.city = req.body.city || user.city;
            // user.state = req.body.state || user.state;
            // user.zipCode = req.body.zipCode || user.zipCode;
            // user.country = req.body.country || user.country;
            user = _.merge(user, req.body);


            user.save(function (err) {
                if (err) {
                    return res.json({success: false, err: err});
                }

                return res.status(200).json({
                    success: true,
                    message: 'User has been updated',
                    //HATEOS (in case it is required)
                    url: httpUtils.getAbsUrl(req) + '/users/' + user._id
                });
            });


        });

    },
    //delete - DELETE  /api/users/10
    remove: function (req, res) {

        var userId = req.body.id || req.params.id || req.headers["x-user-id"];


        User.remove({_id: userId}, function (err) {

            if (err)
                return httpUtils.handleError(res, err);

            return res.status(204).send("Removed!");

        });


    },


    //************************************************************************************
    //STATISTICS for Users used by api.route("/stats/:id")
    //************************************************************************************
    //get all user's stats
    getStats: function (req, res) {
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];

        User.findById(userId).select("_id username kills deaths wins losses").lean().exec(function (err, user) {
            if (err)
                return httpUtils.handleError(res, err);


            if (user === null || user === undefined)
                return res.json({});

            //According to Requirements: In case we need to explicitly return counts we can do it using the following way
            if (!user.wins)
                user.wins = 0;


            user.personalInfo = httpUtils.getAbsUrl(req) + "/users/" + user._id;


            return res.json(user);


        });


    },
    //update stats for specific user
    updateStats: function (req, res) {

        var userId = req.body.id || req.params.id || req.headers["x-user-id"];

        User.findById(userId).select('_id kills deaths wins losses').exec(function (err, user) {
            if (err)
                return httpUtils.handleError(res, err);


            if (!user)
                return httpUtils.sendNotFound("User Not Found");


            // user.kills = req.body.kills  || user.kills;
            // user.deaths = req.body.deaths || user.deaths;
            // user.wins = req.body.wins || user.wins;
            // user.losses = req.body.losses || user.losses;


            user = _.merge(user, req.body);

            user.save(function (err) {
                if (err)
                    return httpUtils.handleError(res, err);

                return res.json({success: true, message: "Stats have been updated successfully", obj: user});


            });


        });


    },

    resetStats: function (req, res) {

        //should be enhanced not to reset even if it is not existing - I can do it :)
        req.body = _.merge(req.body, zeroStats);


        return self.updateStats(req, res);


    },

    //************************************************************************************
    //Matches for user used by api.route("/awards/:id")
    //************************************************************************************

    getAwards: function (req, res) {
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];

        if(!userId){
            return res.status(403).send("No Content");//forbidden

        }

        User.findById(userId).select('_id awards').exec(function (err, user) {
            if (err)
                return httpUtils.handleError(res, err);

            if (!user)
                return httpUtils.sendNotFound("User Not Found");

            return res.json(user);
        });
    },

    addAwards: function (req, res) {
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];

        User.update({_id: userId},
            {
                $push: {
                    "awards": {
                        $each: matches
                    }
                },
                $sort: {issueDate: -1}, //descending order of awards to get the last earned awards quickly
                $slice: 100
            },
            function (err, user) {
                if(err)
                    return httpUtils.handleError(res, err);
                return res.json({success: true, message: "Awards list has been updated successfully", user: user});
            });
    },

    //************************************************************************************
    //Matches for user used by api.route("/match/:id")
    //************************************************************************************

    //GET /api/users/match/10
    //get current match for user having an Id = 10

    getCurrentMatch: function (req, res) {
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];


        User.findById(userId).select('_id currentMatch').exec(function (err, user) {

            if (!user.currentMatch)
                return res.json({});

            Match.findById(user.currentMatch._id, function (err, match) {
                if (err)
                    return httpUtils.handleError(res, err);


                return res.json(match);
            })


        });
    },

    //PUT /api/users/match/{user_id}/{match_id}
    //update the current match for user with id = 10
    //used by api.put("/match/:id/:matchId", );
    updateCurrentMatch: function (req, res) {

        //we should add to user collection and also to matches section


    },

    //in case we need to get all matches for specific user
    // (we should tackle this using different table to partition data using userId - Indexing using userId to get it quickly)
    // or to save matches references in the same table (this is in case if we are storing hundereds of them) - I will go for this approach for simplicity
    getMyMatches: function (req, res) {
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];

        User.findById(userId).select("_id myMatches").lean().exec(function (err, myMatches) {
            if (err)
                return httpUtils.handleError(res, err);

            Match.find({_id: {$in: myMatches}}, function (err, matches) {

                if (err)
                    return httpUtils.handleError(res, err);

                return res.json(matches);

            })


        });

    },

    add2MyMatches: function (req, res) {
        var userId = req.body.id || req.params.id || req.headers["x-user-id"];
        var matches = req.body.matches;

        User.findByIdAndUpdate(userId,
            {
                $push: {
                    "myMatches": {
                        $each: matches
                    }
                },
                safe: true,
                new: true,
                upsert: true
            }, function (err, user) {
                if (err)
                    return httpUtils.handleError(res, err);

                return res.json({success: true, message: "Match(s) have been added to user", user: user});
            }
        );


    }

};















