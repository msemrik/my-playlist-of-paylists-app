var spotifyapi = require('../SpotifyApi');
var restController = require('../RestController');
var {Validator, ValidationError} = require('express-json-validator-middleware');

var Users = require('./securityconfiguration').Users;

function initRestEndPoints(app) {
    // Initialize a Validator instance first
    var validator = new Validator({allErrors: true}); // pass in options to the Ajv instance
    // Define a shortcut function
    var validate = validator.validate;

    app.post('/signup', function (req, res) {
        var redirected = false;
        if (!req.body.username || !req.body.password) {
            res.status("400");
            res.send("Invalid details!");
        } else {
            Users.filter(function (user) {
                if (user.username === req.body.username) {
                    res.status("500");
                    res.json({"message": "User Already Exists! Login or choose another user id"});
                    redirected = true;
                }

            });
            if (!redirected) {
                var newUser = {username: req.body.username, password: req.body.password};
                Users.push(newUser);
                req.session.user = newUser;
                res.status("200");
                res.end();
            }
        }
    });

    app.post('/login', function (req, res) {
        console.log(Users);
        var redirected = false;
        if (!req.body.username || !req.body.password) {
            res.status("500");
            res.send("Invalid details!");
        } else {
            Users.filter(function (user) {
                if (user.username === req.body.username && user.password === req.body.password) {
                    req.session.user = user;
                    redirected = true;
                    res.status("200");
                    res.end();
                }
            });
            if (!redirected) {
                res.status("500");
                res.json({"message": "Invalid credentials!"});
            }
        }
    });

    app.post('/spotify/islogged', function (req, res) {
        spotifyapi.islogged(res);
    });

    app.post('/spotify/logout', function (req, res) {
        spotifyapi.logout(res);
    });

    app.post('/spotify/user/playlists', function (req, res) {
        spotifyapi.getSpotifyUserPlaylists(res);
    });

    app.post('/spotify/createplaylist', function (req, res) {
        spotifyapi.createPlaylist(req, res);
    });


    var UpdatePlaylistSchema = {
        "type": 'object',
        "properties":
            {
                "playlistToUpdate": {
                    "type": "object",
                    "properties": {
                        "id": {"type":"string"},
                        "includedPlaylists": {"type": "array"}
                    }
                }
            },
        "required": ["playlistToUpdate"]
    };
    app.post('/updateplaylist', validate({body: UpdatePlaylistSchema}), function (req, res) {
        restController.updatePlaylist(req, res);
    });

}

module.exports = initRestEndPoints;
