//Import the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://msemrik:0147258369Mb@cluster0-fmguv.mongodb.net/my-playlist-of-playlists-app?retryWrites=true';
var promise = mongoose.connect(mongoDB, {useNewUrlParser: true})
    .then(() => {
        console.log('Database connection successful')
    })
    .catch(err => {
        console.error('Database connection error')
    });

let playlistSchema = new mongoose.Schema({
    playlists: Array
});

var PlaylistModel = mongoose.model('Playlist', playlistSchema)

let msg = new PlaylistModel({playlists:[]});
msg.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    });


promise.then(function(){console.log('despues de succesful si o si');

    PlaylistModel.find({
        // email: 'ada.lovelace@gmail.com'   // search query
    })
        .then(doc => {
            console.log(doc)
        })

        .catch(err => {
            console.error(err)
        })});

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var User = mongoose.model('User', new Schema({url: String, text: String, id: Number}, {collection: 'playlists'}));

console.log(User);
module.exports = db;


