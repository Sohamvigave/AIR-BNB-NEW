const express = require("express");
const router = express.Router({mergeParams: true});
const {isLoggedIn, validateReview} = require("../middlewares/middleware.js");
const reviewController = require("../controllers/reviews.js");


// CREATE ROUTE 
router.post("/",isLoggedIn, validateReview, reviewController.createReview);

// DELETE ROUTE
router.delete("/:reviewId",isLoggedIn, reviewController.deleteReview);

module.exports = router;