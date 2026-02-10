const Listings = require("../models/listings.js");

module.exports.renderNewListingForm = (req, res) => {
    res.render("listings/new");
};

module.exports.createNewListing = async (req, res) => {
    let newListing = new Listings(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing was created!");
    res.redirect("/listings");
};

module.exports.renderAllListings = async (req, res) => {
    let AllListings = await Listings.find({});
    res.render("listings/index", {AllListings});
};

module.exports.renderOneListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findOne({_id:id}).populate("reviews");
    if (!listing) {
        req.flash("error", "listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/show",{listing});
    }  
};

module.exports.renderEditListingForm = async (req, res) => {
    let listing = await Listings.findById(req.params.id);
    if (!listing) {
        req.flash("error", "listing you want to update for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/edit", {listing});
    }
};

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    let data = req.body.listing;
    let editedListing = await Listings.findByIdAndUpdate(id, {...data}, {new:true, runValidators:true});
    console.log(editedListing);
    req.flash("success", "Listing was updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    await Listings.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing was deleted!");
    res.redirect("/listings");
}