const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {isLoggedIn, validateListing} = require("../middlewares/middleware.js");
const listingController = require("../controllers/listings.js");

// CREATE ROUTE - 1
router.get("/new",isLoggedIn, listingController.renderNewListingForm );

// CREATE ROUTE - 2
router.post("/", validateListing, wrapAsync(listingController.createNewListing)); 

// SHOW ROUTE - 1
router.get("/", listingController.renderAllListings);

// SHOW ROUTE - 2
router.get("/:id", validateListing, wrapAsync(listingController.renderOneListing));

// EDIT ROUTE - 1
router.get("/:id/edit",isLoggedIn, validateListing, listingController.renderEditListingForm);

// EDIT ROUTE - 2
router.put("/:id", validateListing, listingController.editListing);

//DELETE ROUTE
router.delete("/:id",isLoggedIn, listingController.deleteListing);

module.exports = router;