var SpotifyWebApi = require('spotify-web-api-node');
var DataBaseAccess = require('./database')

var isClientConected = false;
var userConnectedPromise;
var userID;
var userInfo;

//TODO we'll need one spotifyApiObject per logged user
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

function islogged(res) {
    if (!userID) {
        res.status(500);
    } else {
        res.json(userInfo);
        res.status(200);
    }
    res.end();
}

function logout(res) {
    spotifyApi.setAccessToken(undefined);
    userID = undefined;
    res.status(200);
    res.end();
}

function logoutWhenClosingAppSession() {
    if (userID) {
        userID = undefined;
        spotifyApi.setAccessToken(undefined);
    }
}

//TODO this should return the userId for future calls from browser
function login(code, res) {

    clientConnectedPromise.then(function () {
        userConnectedPromise = spotifyApi.authorizationCodeGrant(code).then(
            function (data) {
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                userID = data.body.id
                return res;
            },
            function (err) {
                userID = undefined;
                console.log('Something went wrong on connecting user to spotify!', err);
            }).then(function (res) {
            spotifyApi.getMe()
                .then(function (data) {
                    console.log('Some information about the authenticated user', data.body);
                    userID = data.body.id;
                    userInfo = data.body;
                    res.redirect('/');
                }, function (err) {
                    console.log('Something went wrong!', err);
                })
        });
    });
}

function getUnionOfDBAndSpotifyUserPlaylists(res) {
    if (userID) {
        spotifyApi.getUserPlaylists(userID).then(function (SPOTIFYPlaylistsObject) {
            DataBaseAccess.getPlaylists().then(function (DBPlaylistsObject) {
                console.log(DBPlaylistsObject);

                var playlistsToReturn = {
                    configuredPlaylists: getConfiguredSpotifyPlaylists(DBPlaylistsObject, SPOTIFYPlaylistsObject),
                    spotifyPlaylists: SPOTIFYPlaylistsObject.body.items
                };

                res.status(200);
                res.json(playlistsToReturn)
            });
        }, function (err) {
            console.log('error: ' + err);
        });
    }
}

// function getSpotifyUserPlaylists(res) {
//     if (userID) {
//         spotifyApi.getUserPlaylists(userID).then(function (SPOTIFYPlaylistsObject) {
//             console.log(SPOTIFYPlaylistsObject);
//             res.status(200);
//             res.json(SPOTIFYPlaylistsObject.body.items);
//         });
//     }
// }

function createPlaylist(req, res) {
    if (userID) {
        spotifyApi.createPlaylist(userID, req.body.name, {'public': false})
            .then(function (data) {
                console.log('Spotify Created playlist!');
                DataBaseAccess.addPlaylist(data).then(function (playlists) {
                    console.log('Database Created playlist!');
                    res.status(200);
                    res.json(playlists);
                });
            }, function (err) {
                console.log('Something went wrong!', err);
                res.status(400);
                res.json(err);
            });
    }
}


function getConfiguredSpotifyPlaylists(DBPlaylistsObject, SPOTIFYPlaylistsObject) {
    var DBPlaylistsObjectIDs = DBPlaylistsObject.playlists.map(itemY => {
        return itemY.playlistId;
    });
    return SPOTIFYPlaylistsObject.body.items.filter(itemX => DBPlaylistsObjectIDs.includes(itemX.id));
}

module.exports = {
    islogged: islogged,
    login: login,
    logout: logout,
    logoutWhenClosingAppSession: logoutWhenClosingAppSession,
    getSpotifyUserPlaylists: getUnionOfDBAndSpotifyUserPlaylists,
    createPlaylist: createPlaylist
}