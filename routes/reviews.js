const express = require("express");
const Review = require("../models/reviews.js");
const Listings = require("../models/listings.js");
const router = express.Router({mergeParams: true});
const { reviewSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js");

// SERVER SIDE VALIDATION 
const validateReview = (req, res, next) => {

    let {error} = reviewSchema.validate(req.body);

    if(error) {
        throw new expressError(400, error);
    } else {
        next();
    }
};

// CREATE ROUTE 
router.post("/", validateReview, async (req, res) => {

    let review = new Review(req.body.review);

    let listing = await Listings.findById(req.params.id);
    
    listing.reviews.push(review);
    
    await review.save();
    await listing.save();

    res.redirect(`/listings/${listing.id}`);
});

// DELETE ROUTE
router.delete("/:reviewId", async (req, res) => {

    let {id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
});

module.exports = router;