var database = require('./DatabaseApi');
var spotifyApi = require('./SpotifyApi');
var async = require('async');
var validate = require('jsonschema').validate;
var jsonSchemas = require('./configuration/JSONSchemas');
var logger = require('./configuration/Logger').logger;
var _ = require('lodash');

var sessionHandler = require('./configuration/SessionHandler');

module.exports = {

    isLogged: function (req, res) {
        try {
            var loggedUser = sessionHandler.isLogged(req.sessionID)
            if (!loggedUser) {
                res.status(500);
                res.end();
            } else {
                res.status(200);
                res.json(loggedUser)
                res.end();
            }
        } catch (e) {
            logger.error("Error when checking if user is logged: " + e);
            res.status(500);
            res.end();
        }
    },

    login: function (req, res, code) {
        async.waterfall(
            [


                spotifyApi.login(code),


                (spotifyUserObject, callback) => {
                    try {
                        callback(null, sessionHandler.updateSession(req.sessionID, spotifyUserObject));
                    } catch (e) {
                        logger.error("Error while logging in: ", e);
                        callback(createGenericErrorObject("500-01", "Error while logging in. Please retry."))
                    }

                },


                (spotifyUserObject, callback) => {
                    spotifyApi.getUserInfo(spotifyUserObject, callback)(callback);
                },


                (spotifyUserDataObject, callback) => {
                    try {
                        callback(null, sessionHandler.updateSession(req.sessionID, spotifyUserDataObject));
                    } catch (e) {
                        logger.error("Error while logging in: ", e);
                        callback(createGenericErrorObject("500-01", "Error while logging in. Please retry."))
                    }
                },

            ],

            function (err) {
                if (err) {
                    logger.error("Error while logging in to Spotify: ", err);
                    sessionHandler.removeSession(req.sessionID);
                    res.redirect('/?loginerror');
                } else {
                    res.redirect('/');
                }


                return;

            });
    },

    logout: function (req, res, code) {
        try {
            sessionHandler.removeSession(req.sessionID);
            req.session.destroy();
        } catch (e) {
            logger.error("Error while loging out Spotify: " + e);
        }
        res.redirect('/');

    },

    getUserPlaylists: function (req, res) {
        var loggedUser = sessionHandler.isLogged(req.sessionID);
        if (loggedUser) {
            async.parallel([

                spotifyApi.getSpotifyUserPlaylists(loggedUser),

                database.getConfiguredPlaylists(loggedUser.id),

            ], function (err, returnedObject) {
                if (err) {
                    logger.error("Error while getting User Playlists: ", err);
                    // validate(err, jsonSchemas);
                    res.status(500);
                    res.json(err);
                    res.end();
                } else {

                    try{
                        res.status(200);
                        res.json({
                            configuredPlaylists: getConfiguredSpotifyPlaylists(returnedObject[1], returnedObject[0]),
                            spotifyPlaylists: returnedObject[0].body.items
                        })
                        res.end();
                    } catch (e) {
                        logger.error("Internal error while converting User Playlist to be returned: ", err);
                        res.status(500);
                        res.json(createGenericErrorObject("500-02", "Internal error while retrieving Spotify playlists: "));
                        res.end();
                    }


                }
            });
        } else {
            res.status(500);
            res.json(spotifyApi.createSpotifyErrorObject(true, '', "Your session expired. Please re login."));
            res.end();
        }
    },

    createPlaylist: function (req, res) {
        var loggedUser = sessionHandler.isLogged(req.sessionID);
        if (loggedUser) {
            async.waterfall([

                spotifyApi.createPlaylist(loggedUser, req.body.name),

                (spotifyPlaylistObject, callback) => {
                    database.addPlaylist(loggedUser, spotifyPlaylistObject)(callback)
                }


            ], function (err, returnedObject) {
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
        } else {
            res.status(500);
            res.json(spotifyApi.createSpotifyErrorObject(true, '', "Your session expired. Please re login."));
            res.end();
        }

    },

    updatePlaylist: function (req, res) {
        var loggedUser = sessionHandler.isLogged(req.sessionID);
        if (loggedUser) {
            async.series([

                database.updatePlaylist(loggedUser, req),
                spotifyApi.updatePlaylist(loggedUser, req.body.playlistToUpdate)

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
        } else {
            res.status(500);
            res.json(spotifyApi.createSpotifyErrorObject(true, '', "Your session expired. Please re login."));
            res.end();
        }
    }
}

function getConfiguredSpotifyPlaylists(DBPlaylistsObject, SPOTIFYPlaylistsObject) {
    if (!DBPlaylistsObject || DBPlaylistsObject.playlists.length === 0 || SPOTIFYPlaylistsObject.body.items.length === 0) {
        return [];
    }

    var DBPlaylistsObjectIDs = DBPlaylistsObject.playlists.map(dbObject => {
        return dbObject.playlistId;
    });
    return SPOTIFYPlaylistsObject.body.items.filter(spotifyObject => DBPlaylistsObjectIDs.includes(spotifyObject.id))
        .map((spotifyObject) => {
            spotifyObject.includedPlaylists = (_.find(DBPlaylistsObject.playlists, {"playlistId": spotifyObject.id}).includedPlaylists);
            return spotifyObject;
        })
}

function createGenericErrorObject(errorCode, customErrorMessage) {
    return {
        errorType: "internalServerError",
        errorCode: errorCode,
        customErrorMessage: customErrorMessage
    };
}