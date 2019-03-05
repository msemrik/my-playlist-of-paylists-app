var _ = require('lodash');
var mongoose = require('mongoose');
var async = require('async');
var dataBasePromiseConnection = null;
var isDataBaseConnected = false;
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
        dataBasePromiseConnection = mongoose.connect(mongoDB, {useNewUrlParser: true})
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

var getConfiguredPlaylists = function (loggedId) {
    return (callback) => {
        getDataBasePromiseConection().then(function () {
            PlaylistModel.findOne({'_id': loggedId}, function (err, person) {
                if (err) return callback(createDatabaseErrorObject("Internal Error. Error while getting configured playlist"));
                if (person) return callback(null, person._doc);
                else callback(null, undefined);

            });
        });
    }
}

var updateDBPlaylistsObject = function (DBPlaylistsObject) {
    return (callback) => {
        getDataBasePromiseConection().then(function () {
            PlaylistModel.findOneAndReplace({_id: DBPlaylistsObject._id}, DBPlaylistsObject
                , function (err, res) {
                    if (err) callback(err);
                    else callback(null, res);
                }
            )
        })
    }
}

var createEmptyDBPlaylistsObject = function (loggedUserId) {
    return (callback) => {
        let newDBPlaylistDBModelToBeSave = new PlaylistModel();
        newDBPlaylistDBModelToBeSave._doc._id = loggedUserId;
        getDataBasePromiseConection().then(function () {
            newDBPlaylistDBModelToBeSave.save()
                .then(doc => {
                    callback(null, doc._doc);
                })
                .catch(err => {
                    callback(err);
                });
        })
    }
}

var addPlaylist = function (loggedUser, spotifyPlaylistObject) {
    return (callback) => {

        async.waterfall([
            getConfiguredPlaylists(loggedUser.id),

            (databasePlaylistObject, callback) => {
                if (!databasePlaylistObject) {
                    createEmptyDBPlaylistsObject(loggedUser.id)(callback)
                } else {
                    callback(null, databasePlaylistObject);
                }
            },

            (databasePlaylistObject, callback) => {
                databasePlaylistObject.playlists.push({
                    playlistId: spotifyPlaylistObject.body.id,
                    name: spotifyPlaylistObject.body.name
                });

                updateDBPlaylistsObject(databasePlaylistObject)(callback);
            }


        ], function (err, returnedObject) {
            if (err) {
                callback(err);
            } else {
                callback(null, returnedObject)
            }
            ;
        });
    }

}

function createIncludedPlaylists(playlistToUpdate) {
    var includedPlaylistsObject = [];
    playlistToUpdate.includedPlaylists.map((includedPlaylistId) => includedPlaylistsObject.push({playlistId: includedPlaylistId}));
    return includedPlaylistsObject;
}

function updatePlaylist(loggedUser, req) {
    return (callback) => {

        async.waterfall([

            getConfiguredPlaylists(loggedUser.id),


            (userConfiguredPlaylists, callback)=>{

                playlistToUpdate = req.body.playlistToUpdate;
                var storedPlaylist = _.find(userConfiguredPlaylists.playlists, {'playlistId': playlistToUpdate.id});
                storedPlaylist.includedPlaylists = createIncludedPlaylists(playlistToUpdate);
                console.log("updated playlist " + playlistToUpdate)

                updateDBPlaylistsObject(userConfiguredPlaylists)(callback);
        }

        ], function (err, result) {
            if (err) {
                callback(err);
            }
            ;
            if (result) {
                console.log('result: ' + result);
                callback(null, true);
            }
            ;
        })
    }


}


function createDatabaseErrorObject(customErrorMessage) {
    return {
        errorType: "dbError",
        customErrorMessage: customErrorMessage
    };
}

module.exports =
    {
        getConfiguredPlaylists: getConfiguredPlaylists,
        addPlaylist: addPlaylist,
        updatePlaylist: updatePlaylist
    };