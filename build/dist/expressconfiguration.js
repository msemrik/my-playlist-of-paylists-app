var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var spotifyapi = require('./spotifyapi');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

var Users = [];

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port);

app.get('/', checkSignIn, function (req, res) {
    var code = req.query.code;
    if (code) {
        spotifyapi.login(code,res);
    } else {

        if (!req.query.testFlag) {
            res.render('index');
        } else {
            res.render('index', {"testFlag": true});
        }
    }
});

app.use('/', function (err, req, res, next) {
    console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/login?triedToGetIn=true');
});

app.get('/signup', function (req, res) {
    if (!req.session.user) {
        res.render('signup');
    } else {
        res.redirect('/?testFlag=true');
    }
});

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

app.get('/login', function (req, res) {
    if (!req.session.user) {
        res.render('login');
    } else {
        res.redirect('/?testFlag=true');
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

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/login');
});

app.post('/spotify/islogged', function (req, res) {
    spotifyapi.islogged(res);
});

app.get('/spotify/login', function (req, res) {
    var scopes = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + '2d38f2f3447c478eb13d74c62b5eb58a' +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent('http://localhost:3000/'));
});

app.post('/spotify/logout', function (req, res) {
    spotifyapi.logout(res);
});

app.post('/spotify/user/playlist', function (req, res) {
    spotifyapi.getUserPlaylists(res);
});


function isLoggedIn(req) {
    return req.session.user;
};

function checkSignIn(req, res, next) {
    if (isLoggedIn(req)) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(isLoggedIn(req));
        next(err);  //Error, trying to access unauthorized page!
    }
}

