var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('lodash');
var flatMap = require('array.prototype.flatmap');
var logger = require('./configuration/Logger').logger;
var loggerMessages = require('./configuration/Logger').loggerMessages;
var createErrorObject = require('./configuration/Logger').createErrorObject;
var generateErrorMessageToLog = require('./configuration/Logger').generateErrorMessageToLog;
var async = require('async');

spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

var clientConnectedPromise = spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        logger.error(generateErrorMessageToLog(createErrorObject(loggerMessages.clientConnectToSpotifyFailed, err)));
    });

function login(code) {
    return (callback) => {
        clientConnectedPromise.then(function () {
            spotifyApi.authorizationCodeGrant(code).then(
                function (data) {
                    spotifyClientObject = {
                        acesstoken: data.body['access_token'],
                        refreshtoken: data.body['refresh_token'],
                        tokenexpiration: data.body['expires_in'],
                        userID: data.body.id
                    };

                    callback(null, spotifyClientObject);
                },
                function (err) {
                    callback(createErrorObject(loggerMessages.loggingInSpotifyError, err));
                }).catch((err) => {
                    callback(createErrorObject(loggerMessages.loggingInInternalError, err));
                }
            )
        });
    }
}

function getUserInfo(spotifyUserObject) {
    return (callback) => {
        var loggedInSpotifyApi = new SpotifyWebApi();
        loggedInSpotifyApi.setAccessToken(spotifyUserObject.acesstoken);
        loggedInSpotifyApi.getMe()
            .then(function (data) {
                userData = data.body;
                callback(null, userData);
            }, function (err) {
                callback(createErrorObject(loggerMessages.gettingUserSpotifyError, err));
            }).catch((err) => {
            callback(createErrorObject(loggerMessages.gettingUserSpotifyError, err));
        });
    }
}

function getSpotifyUserPlaylists(loggedUser) {
    return (callback) => {
        var loggedInSpotifyApi = new SpotifyWebApi();
        loggedInSpotifyApi.setAccessToken(loggedUser.acesstoken);
        loggedInSpotifyApi.getUserPlaylists(loggedUser.id, {limit: 50}).then(function (spotifyPlaylistsObject) {
            callback(null, spotifyPlaylistsObject);
        }, function (err) {
            callback(createErrorObject(loggerMessages.gettingSpotifyPlaylistsSpotifyError, err));
        }).catch((err) => {
            callback(createErrorObject(loggerMessages.gettingSpotifyPlaylistsInternalError, err))
        });
    }
}

function createPlaylist(loggedUser, playlistName) {
    return (callback) => {
        var loggedInSpotifyApi = new SpotifyWebApi();
        loggedInSpotifyApi.setAccessToken(loggedUser.acesstoken);
        loggedInSpotifyApi.createPlaylist(loggedUser.id, playlistName, {'public': false})
            .then(function (data) {
                callback(null, data)
            }, function (err) {
                callback(createErrorObject(loggerMessages.creatingSpotifyPlaylistsSpotifyError, err));
            }).catch((err) => {
            callback(createErrorObject(loggerMessages.creatingSpotifyPlaylistsInternalError, err));
        });
    }
}

function updatePlaylist(loggedUser, playListToUpdate) {
    return (callback) => {

        var promises = [];
        var loggedInSpotifyApi = new SpotifyWebApi();
        loggedInSpotifyApi.setAccessToken(loggedUser.acesstoken);

        createPromisesForGettingPlaylistsTracksForEachIncludedPlaylist(promises, loggedInSpotifyApi, playListToUpdate);

        var playlistId = playListToUpdate.id;
        Promise.all(promises).then(
            (tracklistToIncludeArray) => {

                replaceTracksInPlaylists(tracklistToIncludeArray, playlistId, loggedInSpotifyApi, callback);

            }).catch(
            (err) => {
                callback(createErrorObject(loggerMessages.updatingSpotifyPlaylistInternalError, err))
            })
    }
}


function replaceTracksInPlaylists(tracklistToIncludeArray, playlistId, loggedInSpotifyApi, callback) {

    var flattenTracklistArray = flatMap(tracklistToIncludeArray, x => x);
    var splittedTracklistArray = _.chunk(flattenTracklistArray, 90);

    var insertPromises = [];
    splittedTracklistArray.forEach((arraySplit) => {
        insertPromises.push(
            addTracksToPlaylist(playlistId, arraySplit, loggedInSpotifyApi)
        )
    });

    async.series(
        _.concat(removeAllTracksFromPlaylist(playlistId, loggedInSpotifyApi), insertPromises),
        (err, returnedObject) => {
            if (err) {
                callback(err);
            } else {
                callback(null, returnedObject)
            }
            ;
        });
}

function removeAllTracksFromPlaylist(playlistId, loggedInSpotifyApi) {
    return (callback) => {
        loggedInSpotifyApi.replaceTracksInPlaylist(playlistId, []).then(() => {
            callback(null);
        }, function (err) {
            callback(createErrorObject(loggerMessages.removingTracksToSpotifyPlaylistSpotifyError, err))
        })
            .catch((err) => {
                callback(createErrorObject(loggerMessages.removingTracksToSpotifyPlaylistInternalError, err))
            });
    }
}

function addTracksToPlaylist(playlistId, tracksArray, loggedInSpotifyApi) {
    return (callback) => {
        loggedInSpotifyApi.addTracksToPlaylist(playlistId, tracksArray).then(() => {
            callback(null);
        }, function (err) {
            callback(createErrorObject(loggerMessages.insertingTracksToSpotifyPlaylistSpotifyError, err))
        })
            .catch((err) => {
                callback(createErrorObject(loggerMessages.insertingTracksToSpotifyPlaylistInternalError, err))

            });
    }
}

function createPromisesForGettingPlaylistsTracksForEachIncludedPlaylist(promises, loggedInSpotifyApi, playListToUpdate) {

    playListToUpdate.includedPlaylists.map((playlistIncluded) => {
        promises.push(
            getNextPlaylistsTrackPromise(loggedInSpotifyApi, undefined, playlistIncluded)
        );
    });
}

function getNextPlaylistsTrackPromise(loggedInSpotifyApi, res, playlistIncluded) {
    return new Promise((resolve, reject) => {
        loggedInSpotifyApi.getPlaylistTracks(playlistIncluded, {offset: res ? res.body.limit + res.body.offset : 0}).then(
            (res) => {
                if (res.body.next) {
                    getNextPlaylistsTrackPromise(loggedInSpotifyApi, res, playlistIncluded).then(
                        (object) => resolve(_.concat(object, res.body.items.map((item) => item.track.uri)))
                    ).catch(
                        (err) => {
                            reject(createErrorObject(loggerMessages.gettingSpotifyPlaylistTracksInternalError, err));
                        }
                    );
                } else {
                    resolve(res.body.items.map((item) => item.track.uri));
                }
            },
            (err) => {
                reject(createErrorObject(loggerMessages.gettingSpotifyPlaylistTracksSpotifyError, err));
            }).catch(
            (err) => {
                reject(createErrorObject(loggerMessages.gettingSpotifyPlaylistTracksInternalError, err));
            }
        );
    });
}

module.exports = {
    login: login,
    getUserInfo: getUserInfo,
    createPlaylist: createPlaylist,
    getSpotifyUserPlaylists: getSpotifyUserPlaylists,
    updatePlaylist: updatePlaylist,

}