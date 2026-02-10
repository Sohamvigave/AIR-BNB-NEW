const {reviewSchema, listingSchema} = require("../schema.js");

function isLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash("error", "you must be logged in!");
        return res.redirect("/users/login");
    }
    next();
}

// SERVER SIDE VALIDATION 
const validateReview = (req, res, next) => {

    let {error} = reviewSchema.validate(req.body);

    if(error) {
        throw new expressError(400, error);
    } else {
        next();
    }
};

// SERVER SIDE VALIDATION
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new expressError(400, error);
    } else {
        next();
    };
};

module.exports = {isLoggedIn, validateReview, validateListing};