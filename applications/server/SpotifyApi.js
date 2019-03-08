var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('lodash');
var flatMap = require('array.prototype.flatmap');
var logger = require('./configuration/Logger').logger;

spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

var clientConnectedPromise = spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        logger.error("Error connecting to App to Spotify: " + err);
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
                    logger.error("Error getting authorization code grant: ", err);
                    callback(createSpotifyErrorObject(true, err.errorMessage, "We got an error reaching Spotify, please retry."));
                }).catch((e) => {
                    logger.error("Internal error while logging in to Spotify: ", e);
                    callback(createSpotifyErrorObject(true, "510-01", "Internal error while logging in to Spotify."));
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
                logger.error('Error while getting User Information', err);
                callback(createSpotifyErrorObject(true, err.errorMessage, "Error while getting User Information"));
            }).catch((e) => {
            logger.error("Internal error while retrieving data from Spotify: " + e);
            callback(createSpotifyErrorObject(true, "510-02", "Internal error while retrieving your data from Spotify, please retry."))
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
            logger.error("Spotify error while retrieving playlists.", err);
            callback(createSpotifyErrorObject(false, err.message, 'Spotify error while retrieving playlists.'));
        }).catch((e) => {
            logger.error("Internal error while retrieving Spotify playlists: ", e);
            callback(createSpotifyErrorObject(true, "510-03", "Internal error while retrieving Spotify playlists."))
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
                logger.error("Internal error while creating a new Spotify playlists: ", e);
                callback(createSpotifyErrorObject(false, err.message, "Internal error while creating a new Spotify playlists"));
            }).catch((e) => {
            logger.error("Internal error while creating a new Spotify playlists: ", e);
            callback(createSpotifyErrorObject(true, "510-04", "Internal error while creating a new Spotify playlists: "))
        });
    }
}


function updatePlaylist(loggedUser, playListToUpdate) {
    return (callback) => {

        var promises = [];

        var loggedInSpotifyApi = new SpotifyWebApi();
        loggedInSpotifyApi.setAccessToken(loggedUser.acesstoken);

        playListToUpdate.includedPlaylists.map((playlistIncluded) => {
            promises.push(
                new Promise((resolve, reject) =>
                    loggedInSpotifyApi.getPlaylistTracks(playlistIncluded).then(
                        (res) => {
                            if (res.body.next) {
                                getNextPlaylistsTrack(loggedInSpotifyApi, res, playListToUpdate.includedPlaylists[0])//(resolve, reject)
                                    .then(
                                        (object) => {
                                            resolve(_.concat(object, res.body.items.map((item) => item.track.uri)))
                                            // var items = _.concat(body.items,res.body.items.map((item) => item.track.uri));
                                            // resolve(items);
                                        }
                                    ).catch(
                                    (err) => reject(err)
                                );
                            } else {
                                var items = res.body.items.map((item) => item.track.uri);
                                resolve(items);
                            }
                        },
                        (err) => {
                            reject(err);
                        }))
            )
        });

        var playlistId = playListToUpdate.id;
        // var removeEveryPlaylistTrack =

        Promise.all(promises).then(
            (returnV) => {
                var tracklistArray = flatMap(returnV, x => x);
                var splittedTracklistArray = _.chunk(tracklistArray, 90);

                Promise.all([
                        new Promise((resolve, reject) => {
                            loggedInSpotifyApi.replaceTracksInPlaylist(playlistId, []).then(() => {
                                resolve(null);
                            }, () =>
                                reject(createSpotifyErrorObject(err.statusCode === 403, err.message, "Error removing previous tracks")))
                        })
                    ]
                ).then(() => {
                    console.log("ended successfully removing");
                    var insertPromises = [];
                    splittedTracklistArray.forEach((arraySplit) => {
                            insertPromises.push(
                                new Promise((resolve, reject) => {
                                    loggedInSpotifyApi.addTracksToPlaylist(playlistId, arraySplit).then(() => {
                                        resolve(null);
                                    }, (err) =>
                                        reject(createSpotifyErrorObject(err.statusCode === 403, err.message, "Error adding tracks to playlist")))
                                })
                            )
                        }
                    );
                    Promise.all(insertPromises).then(() => {
                        console.log("ended successfully");
                        callback(null);
                    }).catch((err) => {
                        console.log("ended with errors");
                        callback(err);
                    });
                }).catch((err) => {
                    console.log("ended with errors");
                    callback(err);
                });
            })
            .catch(
                (err) => {
                    console.log("error: " + err);
                    callback(createSpotifyErrorObject(false, err, "Error while getting spotify's track, please retry"))
                })
    }
}

function getNextPlaylistsTrack(loggedInSpotifyApi, res, playlist) {
    return new Promise((resolve, reject) => {
        var items;
        loggedInSpotifyApi.getPlaylistTracks(playlist, {offset: res.body.limit + res.body.offset}).then(
            (res) => {
                if (res.body.next) {
                    getNextPlaylistsTrack(loggedInSpotifyApi, res, playlist).then(
                        (object) => resolve(_.concat(object, res.body.items.map((item) => item.track.uri)))
                    ).catch((err) => reject(err))
                } else {
                    resolve(res.body.items.map((item) => item.track.uri));
                }
            },
            (err) => {
                reject(err);
            })
    });
}

function createSpotifyErrorObject(shouldReLogInToSpotify, spotifyErrorCode, customErrorMessage) {
    return {
        errorType: "spotifyError",
        shouldReLogInToSpotify: shouldReLogInToSpotify,
        errorCode: spotifyErrorCode,
        customErrorMessage: customErrorMessage
    };
}

module.exports = {
    login: login,
    getUserInfo: getUserInfo,
    createPlaylist: createPlaylist,
    getSpotifyUserPlaylists: getSpotifyUserPlaylists,
    updatePlaylist: updatePlaylist,
    createSpotifyErrorObject: createSpotifyErrorObject

}