/**
 * Created by msoliman on 7/8/17.
 */

var mongoose = require("mongoose");

//Separated Match Schema
var MatchSchema = new mongoose.Schema({

    name: String,
    startedAt: {type: Date, default: Date.now()},
    players: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}],
    //just added in case we need the count quickly in the match - it is better in performance (instead of accessing array 'players')
    playersCount: Number,
    //R means running - F means finished - P means Paused.. we can use short instead that is efficient in storage
    status: {type: String, enum: ["R", "F", "P"]}
});

module.exports = mongoose.model("Matches", MatchSchema);
