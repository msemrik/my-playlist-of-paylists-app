var database = require('./database');
var spotifyApi = require('./SpotifyApi');
var async = require('async');
var validate = require('jsonschema').validate;
var jsonSchemas = require('./configuration/JSONSchemas');


module.exports = {

    updatePlaylist: function (req, res) {
        async.series([
            function (callback) {
                database.updatePlaylist(req, callback)
            }, function (callback) {
                spotifyApi.updatePlaylist(req.body.playlistToUpdate, callback)
            }
        ], function (err) {
            if (err) {
                validate(err, jsonSchemas);
                console.log('error ' + err);
                res.status(500);
                res.json(err);
                res.end();
                return;
            }
            res.status(200);
            res.end();
            return;

        });

    }

}