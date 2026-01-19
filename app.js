const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listings = require("./models/listings");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public/css")));

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

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
app.post("/listings",async (req, res) => {
    let newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// INDEX ROUTE
app.get("/listings", async (req, res) => {
    let AllListings = await Listings.find({});
    // console.log(Listing);
    res.render("index", {AllListings});
});

// SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findOne({_id:id});
    res.render("show",{listing});
});

// EDIT ROUTE
app.get("/listings/:id/edit",async (req, res) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    res.render("edit", {listing});
});

app.put("/listings/:id", async (req, res) => {
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

app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});