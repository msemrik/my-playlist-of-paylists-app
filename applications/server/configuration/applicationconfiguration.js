var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var getendpoints = require('./getpageendpoints');
var restendpoints = require('./restendpoints');

//App Configuration
var app = express();
var upload = multer();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
app.use(express.static(__dirname +'/../public'));
//TODO make env var
// app.set('views', __dirname + '/../../../build/dist/views');
// app.use(express.static(__dirname +'/../../../build/dist/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));
let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}
app.listen(port);


//Init EndPoints
restendpoints(app);
getendpoints(app);