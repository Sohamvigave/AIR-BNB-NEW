const express = require("express");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const Listings = require("../models/listings.js");
const expressError = require("../utils/expressError.js");
const {isLoggedIn} = require("../middleware.js");

// SERVER SIDE VALIDATION
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new expressError(400, error);
    } else {
        next();
    };
};

// CREATE ROUTE - 1
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new");
});

// CREATE ROUTE - 2
router.post(
    "/", validateListing,
    wrapAsync(async (req, res) => {
        let newListing = new Listings(req.body.listing);
        await newListing.save();
        req.flash("success", "New listing was created!");
        res.redirect("/listings");
    })
); 

// SHOW ROUTE - 1
router.get("/",  async (req, res) => {
    let AllListings = await Listings.find({});
    res.render("listings/index", {AllListings});
});

// SHOW ROUTE - 2
router.get("/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findOne({_id:id}).populate("reviews");
    if (!listing) {
        req.flash("error", "listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/show",{listing});
    }        
}));

// EDIT ROUTE - 1
router.get("/:id/edit",isLoggedIn, validateListing, async (req, res) => {
    let listing = await Listings.findById(req.params.id);
    if (!listing) {
        req.flash("error", "listing you want to update for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/edit", {listing});
    }
});

// EDIT ROUTE - 2
router.put("/:id", validateListing, async (req, res) => {
    let {id} = req.params;
    let data = req.body.listing;
    let editedListing = await Listings.findByIdAndUpdate(id, {...data}, {new:true, runValidators:true});
    console.log(editedListing);
    req.flash("success", "Listing was updated!");
    res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
router.delete("/:id",isLoggedIn, async (req, res) => {
    await Listings.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing was deleted!");
    res.redirect("/listings");
});

module.exports = router;