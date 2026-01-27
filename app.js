const express = require("express");

const port = 8080;
const app = express();
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const reviews = require("./routes/reviews.js");
const listings = require("./routes/listings.js");

const path = require("path");
const mongoose = require("mongoose");
const expressError = require("./utils/expressError.js");

const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

app.engine('ejs', ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/listings"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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

// HOME PAGE
app.get("/", (req, res) => {
    res.render("home");
});

// HANDLE ALL ROUTES
app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "page not found"));
});

// ERROR HANDLING
app.use((err, req, res, next) => {
    res.render("error.ejs", {err});
});

// SERVER STARTING ROUTE
app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});