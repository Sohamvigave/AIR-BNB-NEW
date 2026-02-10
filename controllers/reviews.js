const Review = require("../models/reviews.js");
const Listings = require("../models/listings.js");

module.exports.createReview = async (req, res) => {
    let review = new Review(req.body.review);

    let listing = await Listings.findById(req.params.id);
    
    listing.reviews.push(review);
    
    await review.save();
    await listing.save();

    req.flash("success", "New review was created!");

    res.redirect(`/listings/${listing.id}`);
}

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review was deleted!");

    res.redirect(`/listings/${id}`);
}