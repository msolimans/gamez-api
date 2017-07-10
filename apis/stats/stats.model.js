/**
 * Created by msoliman on 7/8/17.
 */

var mongoose = require("mongoose");

//we can separate stats in a separate collection in case we need to get the top players (It's according to requirements)
var StatsSchema = new mongoose.Schema({
    //we should calculate the id here based on stats (wins, losses, deaths ..etc) IN CASE we need to get the top N players for example
    // (indexing and partitioning will be based on it)
    score: {type: Number, index: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
    kills: Number,
    deaths: Number,
    wins: Number,
    losses: Number
});

module.exports = mongoose.model("Stats", StatsSchema);
