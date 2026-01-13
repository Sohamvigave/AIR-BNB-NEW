const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("./models/listings.js");

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

app.get("/testListing", (req, res) => {
    let sampleListing = new Listing({
        title: "my new villa",
        discription: "by the beach",
        price: 5550,
        location: "new delhi",
        country: "india"
    });
    sampleListing.save();
    res.send("testListing");
});

app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});