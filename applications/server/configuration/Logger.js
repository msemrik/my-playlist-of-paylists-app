var winston = require('winston');

module.exports = {
    logger: winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: {service: 'user-service'},
        transports: [
            //
            // - Write to all logs with level `info` and below to `combined.log`
            // - Write all logs error (and below) to `error.log`.
            //
            // new winston.transports.File({ filename: 'error.log', level: 'error' }),
            // new winston.transports.File({ filename: 'combined.log' })
            new winston.transports.Console()
        ]
    }),

    loggerMessages: {
        clientConnectToSpotifyFailed: {errorCode: "500-00-00", errorMessage: "Error when connecting client to Spotify Client. "},

        isLoggedError: {errorCode: "500-01-00", errorMessage: "Error when checking if user is logged. "},

        loggingInSpotifyError: {errorCode: "600-02-00", errorMessage: "Spotify Error when logging in user to Spotify. "},
        loggingInInternalError: {errorCode: "500-02-00", errorMessage: "Internal Error when logging in user to Spotify. "},
        gettingUserSpotifyError: {errorCode: "600-02-01", errorMessage: "Spotify Error when getting user information from Spotify. "},
        gettingUserInternalError: {errorCode: "600-02-01", errorMessage: "Internal Error when getting user information from Spotify. "},

        updatingSessionDataError: {errorCode: "500-02-02", errorMessage: "Internal Error when updating session Data. "},

        loggingOutInternalError: {errorCode: "500-03-00", errorMessage: "Internal Error when logging out. "},

        userNotLoggedError: {errorCode: "500-04-00", errorMessage: "Internal error when trying to perform some action, user seems not to be logged to Spotify"
            , errorToShow: "Your session seems to have expired, please relog in ;)", shouldReLogInToSpotify: true},

        gettingSpotifyPlaylistsSpotifyError: {errorCode: "600-05-00", errorMessage: "Error getting Spotify Playlists. "
            , errorToShow: "Your session seems to have expired, please relog in ;)", shouldReLogInToSpotify: true},
        gettingSpotifyPlaylistsInternalError: {errorCode: "500-05-00", errorMessage: "Internal Error when getting Spotify Playlists. "
            , errorToShow: "Error getting your playlists, please retry."},
        gettingDatabasePlaylistsInternalError: {errorCode: "500-05-01", errorMessage: "Internal Error when getting Database Playlists. "
            , errorToShow: "Error getting your playlists, please retry."},
        convertingPlaylistsToReturnError: {errorCode: "500-05-01", errorMessage: "Internal error while converting User Playlist to be returned. "
            , errorToShow: "Error getting your playlists, please retry."},


    },


    generateErrorMessageToLog: function (error) {
        var errorFormatted = "Error Code: " + error.errorObject.errorCode + ". Error Message: " + error.errorObject.errorMessage;
        errorFormatted += error.exception ? "Exception: " + error.exception : '';
        return errorFormatted;
    },

    generateErrorObjectToReturn: function (error) {
        return {errorCode: error.errorCode, errorToShow: error.errorToShow, shouldReLogInToSpotify: error.shouldReLogInToSpotify};
    },

    createErrorObject: function (errorObject, exception) {
        return {
            errorObject: errorObject,
            exception: exception
        };
    }
};