/**
 * Created by msoliman on 7/8/17.
 */

var Match = require("./match.model");

module.exports = {

    //************************************************************************************
    //GET/POST /api/match
    //************************************************************************************

    //list all current running matches
    getAll: function (req, res) {

        Match.find({}, function (err, matches) {
            if (err)
                return res.json(err);

            return res.json(matches);
        });

    },
    //add new match
    create: function (req, res) {

        var players = req.body.players;

        console.log(players);

        var match = new Match();

        // match = _.merge(match, req.body);
        match.name = req.body.name;
        match.players = players;


        match.save(function (err) {
            if (err)
                return res.json(err);

            return res.json({success: true, message: "Success"});

        });

    },


    //************************************************************************************
    //GET - PUT /api/matches
    //************************************************************************************
    //get specific match with id
    get: function (req, res) {
        var matchId = req.body.id || req.params.id || req.headers["x-match-id"];

        Match.findById(matchId, function (err, match) {
            if (err)
                return res.json(err);

            return res.json(match);
        });


    },

    //update match with new players added to the list (add players)
    update: function (req, res) {

        var id = req.body.id || req.params.id || req.headers["x-match-id"];
        var players = req.body.players;

        Match.findByIdAndUpdate(
            id,
            {
                $push: {"players": {$each: players}},
                $inc: {"playersCount": players.length}
            },
            {safe: true, upsert: true, new: true},
            function (err, match) {
                if (err)
                    return res.json(err);

                return res.json({success: true, message: "Match has been updated", match: match});
            }
        );

    }

};
