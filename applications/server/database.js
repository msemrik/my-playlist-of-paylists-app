var mongoose = require('mongoose');
var playlistpojo = require('./playlistpojo');
var Schema = mongoose.Schema;
var isDataBaseConnected = false;

// var mongoDB = 'mongodb+srv://msemrik:0147258369Mb@cluster0-fmguv.mongodb.net/my-playlist-of-playlists-app?retryWrites=true';
var mongoDB = 'mongodb://localhost:27017/my-playlist-of-playlists-app';

var dataBasePromise = mongoose.connect(mongoDB, {useNewUrlParser: true})
    .then(() => {
        isDataBaseConnected = true;
        console.log('Database connection successful')
    })


    .catch(err => {
        isDataBaseConnected = false;
        console.error('Database connection error')
    });

var getPlaylists = function () {
    return dataBasePromise.then(function () {
        console.log('despues de succesful si o si');

        return PlaylistModel.find().lean().exec(function (err, playlists) {
            return playlists[0];
        });
    });
}

// function PlayListPojo(playlists) {
//     var playlist={};
//     playlists.map()
// }



var savePlaylists = function (playlists) {
    let msg = new PlaylistModel(playlists);

    msg.save()
        .then(doc => {
            console.log(doc)
        })
        .catch(err => {
            console.error(err)
        });
}

var addPlaylist = function (playlist) {
    getPlaylists().then(function(playlists){
        if(playlists != undefined){
            playlists.push(playlist);
        }
        else{
            var object = {playlists : []};

            object.playlists.push({playlistId : playlist.body.id, name: playlist.body.name});
            PlaylistModel.update({},playlists);
            savePlaylists(object);
        }

    })
}

let playlistSchema = new Schema({
    playlists: [{
        playlistId: String,
        name: String,
        playlistsConfigured: [{
            playlistId: String
        }]
    }]
});


var PlaylistModel = mongoose.model('Playlist', playlistSchema)


// getPlaylists();
// savePlaylists({
//     playlists: [{playlistId: 'aaaa1', name: 'aaaa', playlistsConfigured: [{playlistId: 'cccc'}, {playlistId: 'dddd'}, {playlistId: 'eeee'}]},{playlistId: 'bbbb1', name: 'bbbb', playlistsConfigured: [{playlistId: 'cccc'}, {playlistId: 'zzzz'}, {playlistId: 'eeee'}]}]
// });

module.exports = {getPlaylists: getPlaylists, savePlaylists: savePlaylists, addPlaylist: addPlaylist};