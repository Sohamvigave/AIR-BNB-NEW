const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listings = require("./models/listings");
const Review = require("./models/reviews.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

async function main() {
    await mongoose.connect(MONGO_URL);
};

main()
.then(res => {
    console.log("connectio successful");
})
.catch(err => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.render("home");
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new expressError(400, error);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        throw new expressError(400, error);
    } else {
        next();
    }
};

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE - // there is no need to define wrapAsync error handling
// because the latest version of express automatically handle it.
app.post(
    "/listings", validateListing,
    wrapAsync(async (req, res) => {
        let newListing = new Listings(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
); 

// Reviews
app.post("/listings/:id/reviews", validateReview, async (req, res) => {

    let review = new Review(req.body.review);

    let listing = await Listings.findById(req.params.id);

    listing.reviews.push(review);
    
    await review.save();
    await listing.save();

    res.redirect(`/listings/${listing.id}`);
});

// INDEX ROUTE
app.get("/listings",  async (req, res) => {
    let AllListings = await Listings.find({});
    // console.log(Listing);
    res.render("index", {AllListings});
});

// SHOW ROUTE
app.get("/listings/:id", validateListing, async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findOne({_id:id}).populate("reviews");
    res.render("show",{listing});
});

// EDIT ROUTE
app.get("/listings/:id/edit", validateListing, async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render("edit", {listing});
});

app.put("/listings/:id", validateListing, async (req, res) => {
    let {id} = req.params;
    let data = req.body.listing;
    let editedListing = await Listings.findByIdAndUpdate(id, {...data}, {new:true, runValidators:true});
    console.log(editedListing);
    res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// there is no need to throw custom expressError 
// because latest version of express handle it bydefault
app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    res.render("error.ejs", {err});
});

app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});