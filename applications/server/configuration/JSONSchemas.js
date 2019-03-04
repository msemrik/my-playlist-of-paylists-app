module.exports = {

    returnJsonSchema: {
        "errorType": {"type": "string", "enum": ["spotifyError", "dbError", "internalServerError"]},
        "shouldReLogInToSpotify": {"type": "boolean"},
        "errorMessage": {"type": "string"}
    }
}