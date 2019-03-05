var _ = require('lodash');

var sessionsMap = {};

function existSession(sessionId){
    if(sessionId in sessionsMap)
        return sessionsMap[sessionId];
    else {
        return false;
    }
}

function updateSession(sessionId, spotifyUserObject){
    sessionsMap[sessionId] = _.assign({}, spotifyUserObject, sessionsMap[sessionId]);
    return sessionsMap[sessionId];
}

function removeSession(sessionId){
    delete sessionsMap[sessionId];
}

function isLogged(sessionId){
    var existSession = this.existSession(sessionId);
    if (!existSession) {
        return false;
    } else {
        return existSession;
    }
}

module.exports ={existSession: existSession, updateSession: updateSession, removeSession: removeSession, isLogged: isLogged}