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

//Set up Express server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

//Init EndPoints
restendpoints(app);
getendpoints(app);

//Set directories
app.set('views', __dirname + '/../../../build');
app.use(express.static(__dirname +'/../../../build'));

//Configure port
let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}
app.listen(port);


