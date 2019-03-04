var spotifyapi = require('../SpotifyApi');
var securityConfiguration = require('./securityconfiguration');

function initGetEndPoints(app) {

    app.get('/', securityConfiguration.checkSignIn, function (req, res) {
        var code = req.query.code;
        if (code) {
            spotifyapi.login(code, res);
        } else {
            res.render('index');
        }
    });

    app.get('/signup', function (req, res) {
        if (!req.session.user) {
            res.render('signup');
        } else {
            res.redirect('/');
        }
    });

    app.get('/login', function (req, res) {
        if (!req.session.user) {
            res.render('login');
        } else {
            res.redirect('/');
        }
    });

    app.get('/logout', function (req, res) {
        req.session.destroy(function () {
            console.log("user logged out.")
        });
        spotifyapi.logoutWhenClosingAppSession();
        res.redirect('/login');
    });

    app.get('/spotify/login', function (req, res) {
        var scopes = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';
        res.redirect('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + '2d38f2f3447c478eb13d74c62b5eb58a' +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI));
    });

    app.use('/', function (err, req, res, next) {
        if (err && err.name === 'JsonSchemaValidationError') {
            return {}
        }
        console.log(err);
        //User should be authenticated! Redirect him to log in.
        res.redirect('/');
    });

}

module.exports = initGetEndPoints;