function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("you must be logged in");
}

module.exports = {isLoggedIn};