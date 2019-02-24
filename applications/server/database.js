var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var isDataBaseConnected = false;
mongoDB = process.env.DATABASE_URL;
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
    return new Promise(function (resolver, reject) {
        dataBasePromise.then(function () {
            console.log('despues de succesful si o si');

            PlaylistModel.find().lean().exec(function (err, playlists) {
                resolver(playlists[0]);
            });
        });
    })

}

var updatePlaylists = function (playlists) {

    return new Promise(function (resolve, reject) {
            PlaylistModel.findOneAndReplace({_id: playlists._id}, playlists
                , function (err, res) {
                    console.log('error: ' + err);
                    console.log('response: ' + res);
                    resolve(res);
                }
            )
        }
    );

}

var savePlaylists = function (playlists) {
    let msg = new PlaylistModel(playlists);
    msg._doc._id = "my-playlist-id";
    return new Promise(function (resolve, reject) {

        msg.save()
            .then(doc => {
                resolve("my-playlist-id");
            })
            .catch(err => {
                reject(err);
            });
    });

}


var addPlaylist = function (playlist) {
    return new Promise(function (resolve, reject) {
        getPlaylists().then(function (playlists) {
            if (playlists == undefined) {
                savePlaylists().then(function (playlistId) {
                    playlists = {};
                    playlists._id = playlistId;
                    playlists.playlists = [];
                    playlists.playlists.push({playlistId: playlist.body.id, name: playlist.body.name});
                    updatePlaylists(playlists).then(function (data) {
                        resolve(playlists);
                    })
                });
            } else {
                playlists.playlists.push({playlistId: playlist.body.id, name: playlist.body.name});
                updatePlaylists(playlists).then(function (data) {
                    resolve(playlists);
                })
            }
        });
    });
}


let playlistSchema = new Schema({
    _id: String,
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