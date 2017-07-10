/**
 * Created by msoliman on 7/8/17.
 */

module.exports = {
    getAbsUrl: function(req){
        return req.protocol + '://' + req.get('host') + "/api";
    },
    sendNotFound: function(res, message){
        return res.status(404).json({success: true, message: message});
    },
    handleError: function(res, err) {
        return res.status(500).send(err);
    },
    returnEmptyRes: function(res){
        return res.status(204).send("No content");
    },


}
