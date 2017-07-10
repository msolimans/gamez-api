/**
 * Created by msoliman on 7/9/17.
 */


var matchApi = require("./match.api");

module.exports = function (express) {
    var api = express.Router();


    //************************************************************************************
    //GET/POST /api/match
    //************************************************************************************

    api.route("/")
    //list all current running matches
        .get(matchApi.getAll)
        //add new match
        .post(matchApi.create);


    //************************************************************************************
    //GET - PUT /api/matches
    //************************************************************************************
    api.route("/:id")
    //get specific match with id
        .get(matchApi.get)

        //update match with new players added to the list
        .put(matchApi.update);


    return api;

};
