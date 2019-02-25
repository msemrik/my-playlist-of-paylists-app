var spotifyapi = require('../spotifyapi');
var securityConfiguration = require('./securityconfiguration');

function initGetEndPoints(app) {

    app.get('/', securityConfiguration.checkSignIn, function (req, res) {
        var code = req.query.code;
        console.log('inside get. code : ' + code);
        if (code) {
            spotifyapi.login(code, res);
        } else {

            if (!req.query.testFlag) {
                res.render('index');
            } else {
                res.render('index', {"testFlag": true});
            }
        }
    });

    app.get('/signup', function (req, res) {
        if (!req.session.user) {
            res.render('signup');
        } else {
            res.redirect('/?testFlag=true');
        }
    });

    app.get('/login', function (req, res) {
        if (!req.session.user) {
            res.render('login');
        } else {
            res.redirect('/?testFlag=true');
        }
    });

    app.get('/logout', function (req, res) {
        req.session.destroy(function () {
            console.log("user logged out.")
        });
        res.redirect('/login');
    });

    app.get('/spotify/login', function (req, res) {
        var scopes = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';
        res.redirect('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + '2d38f2f3447c478eb13d74c62b5eb58a' +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent('http://localhost:5000/'));
    });

    app.use('/', function (err, req, res, next) {
        console.log(err);
        //User should be authenticated! Redirect him to log in.
        res.redirect('/login?triedToGetIn=true');
    });

}

module.exports = initGetEndPoints;