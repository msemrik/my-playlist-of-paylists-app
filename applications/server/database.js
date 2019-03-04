var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');

var dataBasePromiseConnection = null;
var isDataBaseConnected = false;
var DBPlaylistsObjectId = "my-playlist-id";
var mongoDB = process.env.DATABASE_URL;


var Schema = mongoose.Schema;
let playlistSchema = new Schema({
    _id: String,
    playlists: [{
        playlistId: String,
        name: String,
        includedPlaylists: [{
            playlistId: String
        }]
    }]
});
var PlaylistModel = mongoose.model('Playlist', playlistSchema)


var getDataBasePromiseConection = function () {
    if (!dataBasePromiseConnection) {
        dataBasePromiseConnection = mongoose.connect(mongoDB , {useNewUrlParser: true})
            .then(() => {
                isDataBaseConnected = true;
            })
            .catch(err => {
                isDataBaseConnected = false;
                console.error('Database connection error')
                throw err;
            });
    }

    return dataBasePromiseConnection;
}

//TODO this should be done by user
var getDBPlaylistsObject = function () {
    return new Promise(function (resolver, reject) {
        getDataBasePromiseConection().then(function () {
            PlaylistModel.find().lean().exec(function (err, DBPlaylistsObject) {
                resolver(DBPlaylistsObject[0]);
            });
        });
    })
}

//TODO this should be done by user
var updateDBPlaylistsObject = function (DBPlaylistsObject) {
    return new Promise(function (resolve) {
            getDataBasePromiseConection().then(function () {
                PlaylistModel.findOneAndReplace({_id: DBPlaylistsObject._id}, DBPlaylistsObject
                    , function (err, res) {
                        if (err) console.log('error: ' + err);
                        resolve(res);
                    }
                )
            })
        }
    );
}

//TODO this should be done by user
var createEmptyDBPlaylistsObject = function (newDBPlaylistsObject) {
    let newDBPlaylistDBModelToBeSave = new PlaylistModel(newDBPlaylistsObject);
    newDBPlaylistDBModelToBeSave._doc._id = DBPlaylistsObjectId;
    return new Promise(function (resolve, reject) {
        getDataBasePromiseConection().then(function () {
            newDBPlaylistDBModelToBeSave.save()
                .then(doc => {
                    console.log("playlists object created with ID: " + DBPlaylistsObjectId);
                    resolve(DBPlaylistsObjectId);
                })
                .catch(err => {
                    console.log("error while creating playlists object");
                    reject(err);
                });
        })
    });
}

//TODO this should be done by user
var addNewPlaylistToDBPlaylistsObject = function (newPlaylistToBeSaved) {
    return new Promise(function (resolve, reject) {
        getDBPlaylistsObject().then(function (DBPlaylistsObject) {
            if (!DBPlaylistsObject) {
                createEmptyDBPlaylistsObject().then(function (playlistId) {
                    DBPlaylistsObject = {};
                    DBPlaylistsObject._id = playlistId;
                    DBPlaylistsObject.playlists = [];
                    DBPlaylistsObject.playlists.push({
                        playlistId: newPlaylistToBeSaved.body.id,
                        name: newPlaylistToBeSaved.body.name
                    });
                    updateDBPlaylistsObject(DBPlaylistsObject).then(function (data) {
                        resolve(DBPlaylistsObject);
                    })
                });
            } else {
                DBPlaylistsObject.playlists.push({
                    playlistId: newPlaylistToBeSaved.body.id,
                    name: newPlaylistToBeSaved.body.name
                });
                updateDBPlaylistsObject(DBPlaylistsObject).then(function () {
                    resolve(DBPlaylistsObject);
                })
            }
        });
    });
}

function createIncludedPlaylists(playlistToUpdate) {
    var includedPlaylistsObject = [];
    playlistToUpdate.includedPlaylists.map((includedPlaylistId) => includedPlaylistsObject.push({playlistId: includedPlaylistId}));
    return includedPlaylistsObject;
}

function updatePlaylist(req, callback) {
    request = req.body;

    async.waterfall([

        function (callback) {
            getDataBasePromiseConection().then(function () {
                PlaylistModel.find().lean().exec(function (err, DBPlaylistsObject) {
                    callback(null, DBPlaylistsObject[0]);
                });
            }, (err) => {
                if (err) {
                    console.log('error: ' + err);
                    callback(err)
                }
            });
        },

        function (result, callback) {
            playlistToUpdate = req.body.playlistToUpdate;
            var storedPlaylist = _.find(result.playlists, {'playlistId': playlistToUpdate.id});
            storedPlaylist.includedPlaylists = createIncludedPlaylists(playlistToUpdate);
            console.log("updated playlist " + playlistToUpdate)

            updateDBPlaylistsObject(result).then(function (playlistObject) {
                callback(null, playlistObject);
            }, (err) => {
                if (err) {
                    console.log('error: ' + err);
                    callback(err)
                }
            })
        }
    ], function(err,result){
        if(err){console.log('error: ' + err); callback(err)};
        if(result){console.log('result: ' + result); callback(null, result)};
    })
}

module.exports =
    {
        getPlaylists: getDBPlaylistsObject,
        addPlaylist: addNewPlaylistToDBPlaylistsObject,
        updatePlaylist: updatePlaylist
    };