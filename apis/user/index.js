/**
 * Created by msoliman on 7/9/17.
 */

var userApi = require("./user.api");


module.exports = function (express) {
    var api = express.Router();


    api.route("/")
        //get all users - GET /api/users/
        .get(userApi.getAllPersonalInfos)
        //create user - POST /api/users/
        .post(userApi.create);

    api.get("/full", userApi.getAllFullProfiles);
    api.get("/full/:id", userApi.getFullProfile);

    api.route("/:id")
        //get specific user  - GET /api/users/10
        .get(userApi.getPersonalInfo)
        //update user data - PUT  /api/users/10
        .put(userApi.update)
        //delete - DELETE  /api/users/10
        .delete(userApi.remove);

    //************************************************************************************
    //STATISTICS for Users
    //************************************************************************************

    api.route("/stats/:id")
        //get all user's achievements
        .get(userApi.getStats)

        //update stats for specific user
        .put(userApi.updateStats)
        .delete(userApi.resetStats);

    //************************************************************************************
    //Matches for user
    //************************************************************************************
    api.route("/awards/:id")
        .get(userApi.getAwards)
        .post(userApi.addAwards)
        .put(userApi.addAwards);

    //************************************************************************************
    //Matches for user
    //************************************************************************************

    //GET /api/users/match/10
    //get current match for user having an Id = 10
    api.route("/match/:id")
        .get(userApi.getCurrentMatch);
    //PUT /api/users/match/{user_id}/{match_id}
    //update the current match for user with id = 10

    api.put("/match/:id/:matchId", userApi.updateCurrentMatch);

    //get my matches
    api.get("/matches/:id", userApi.getMyMatches);
    api.put("/matches/:id", userApi.add2MyMatches);


    return api;
};


