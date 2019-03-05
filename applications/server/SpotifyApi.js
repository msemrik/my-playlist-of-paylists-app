var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('lodash');
var async = require('async');
var flatMap = require('array.prototype.flatmap');

var isClientConected = false;
var userConnectedPromise;

spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

var clientConnectedPromise = spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        isClientConected = true;
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Client connected');
    }, function (err) {
        console.log('Something went wrong on connecting client to Spotify!', err);
    });

function login(code) {
    return (callback) => {
        clientConnectedPromise.then(function () {
            userConnectedPromise = spotifyApi.authorizationCodeGrant(code).then(
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
                    callback(createSpotifyErrorObject(true, err.errorMessage, "Error while logging in to Spotify"));
                })
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
                console.log('Something went wrong!', err);
                callback(createSpotifyErrorObject(true, err.errorMessage, "Error while getting User Information"));
            })
    }
}


function getSpotifyUserPlaylists(loggedUser) {
    return (callback) => {
        var loggedInSpotifyApi = new SpotifyWebApi();
        loggedInSpotifyApi.setAccessToken(loggedUser.acesstoken);
        loggedInSpotifyApi.getUserPlaylists(loggedUser.id, {limit: 50}).then(function (spotifyPlaylistsObject) {
            callback(null, spotifyPlaylistsObject);
        }, function (err) {
            callback(createSpotifyErrorObject(false, err.message, 'Error while getting spotify playlists'));
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
                callback(createSpotifyErrorObject(false, err.message));
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


        // //create promises for getting tracks
        // playListToUpdate.includedPlaylists.map((playlistIncluded) => {
        //         promises.push(
        //             (callback) => {
        //                 loggedInSpotifyApi.getPlaylistTracks(playlistIncluded).then(
        //                     (res) => {
        //                         var items = res.body.items.map((item) => item.track.uri);
        //                         callback(null, items);
        //                     },
        //                     (err) => {
        //                         callback(createSpotifyErrorObject(err.statusCode === 403, err.message));
        //                     })
        //             }
        //         );
        //     }
        // );

        // var playlistId = playListToUpdate.id;
        // //execute promises for getting tracks in parallel
        // async.parallel(promises, (err, results) => {
        //     if (err) {
        //         console.log('error updating playlist' + err);
        //         callback(err);
        //     } else {
        //         loggedInSpotifyApi.replaceTracksInPlaylist(playlistId, flatMap(results, x => x)).then(
        //             (result) => {
        //                 callback(null, result);
        //             },
        //             (err) => {
        //                 callback(createSpotifyErrorObject(err.statusCode === 403, err.message));
        //             }
        //         );
        //     }
        // })


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
        spotifyErrorCode: spotifyErrorCode,
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