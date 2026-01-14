const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listings = require("./models/listings");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));

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
    res.send("Hi, I am root");
});

// INDEX ROUTE
app.get("/listings", async (req, res) => {
    let AllListings = await Listings.find({});
    // console.log(Listing);
    res.render("index", {AllListings});
});

app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});