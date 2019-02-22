var Users = [];

function checkSignIn(req, res, next) {
    if (isLoggedIn(req)) {
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(isLoggedIn(req));
        next(err);  //Error, trying to access unauthorized page!
    }
}

function isLoggedIn(req) {
    return req.session.user;
};

module.exports ={checkSignIn : checkSignIn, Users: Users}