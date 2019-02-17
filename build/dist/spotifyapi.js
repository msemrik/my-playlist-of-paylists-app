var booleanTest = true;
var SpotifyWebApi = require('spotify-web-api-node');


var isLoggedToSpotify;
var userID;

spotifyApi = new SpotifyWebApi({
    clientId: '2d38f2f3447c478eb13d74c62b5eb58a',
    clientSecret: '36b86b6a2c29409cb42e63c5c9e45ba5',
    redirectUri: 'http://localhost:5000/'
});

spotifyApi.getMe()
    .then(function (data) {
        isLoggedToSpotify = true;
        console.log('Some information about the authenticated user', data.body);
        return data;
    }, function (err) {
        isLoggedToSpotify = false;
        console.log('Something went wrong!', err);
    })


function islogged(res) {

    console.log('is logged method is in');

    if (!isLoggedToSpotify) {
        res.status(500);
    } else {
        res.status(200);
    }
    res.end();
}

function logout(res) {
    console.log('logout method is in');
    spotifyApi.setAccessToken(undefined);
    isLoggedToSpotify = false;
    res.status(200);
    res.end();
}


function getUserPlaylists(res){
    if(isLoggedToSpotify && userID){

        spotifyApi.getUserPlaylists(userID).then(function(data){
            res.status(200);
            res.json(data.body.items)});
    }
}

function login(code,res) {


    newPromise = spotifyApi.clientCredentialsGrant()
        .then(function(data) {
            console.log('The access token is ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        }, function(err) {
            console.log('Something went wrong!', err);
        });

    newPromise.then(function(){
        return spotifyApi.authorizationCodeGrant(code).then(
            function(data) {
                console.log('The token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);
                console.log('The refresh token is ' + data.body['refresh_token']);

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                userID = data.body.id
                isLoggedToSpotify = true;
                res.redirect('/');
        },
            function(err) {
                isLoggedToSpotify = false;
                console.log('Something went wrong!', err);
            }).then(function(){
                spotifyApi.getMe()
                .then(function (data) {
                    console.log('Some information about the authenticated user', data.body);
                    userID = data.body.id;
                }, function (err) {
                    console.log('Something went wrong!', err);
                })
        });
    });






}


// module.exports = {islogged: function(res) {return islogged(res)}}
module.exports = {islogged: islogged, login: login, logout: logout, getUserPlaylists: getUserPlaylists}