module.exports = {

    returnJsonSchema: {
        "properties":{
            "errorType": {"type": "string", "enum": ["spotifyError", "dbError", "internalServerError"]},
            "shouldReLogInToSpotify": {"type": "boolean"},
            "errorCode": {"type": "string"},
            "errorMessage": {"type": "string"},
        },
        "required": ["errorType", "errorMessage"]

    }
}