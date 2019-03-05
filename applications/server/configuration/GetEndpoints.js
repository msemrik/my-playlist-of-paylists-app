var restController = require('../RestController');

function initGetEndPoints(app) {

    app.get('/', function (req, res) {
        var code = req.query.code;
        if (code) {
            restController.login(req, res, code);
        } else {
            res.render('index');
        }
    });

    app.get('/logout', function (req, res) {
        restController.logout(req, res);
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
            console.log("JsonSchemaValidationError");
        }
        console.log(err);
        res.redirect('/');
    });

}

module.exports = initGetEndPoints;