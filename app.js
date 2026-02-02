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
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const expressSession = {
    secret: "mySuperSecretString",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.engine('ejs', ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(flash());
app.use(session(expressSession));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")));

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

const User = require("./models/users.js");

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
    res.render("listings/home.ejs");
});

// HANDLE ALL ROUTES
app.all(/.*/, (req, res, next) => {
    next(new expressError(404, "page not found"));
});

// ERROR HANDLING
app.use((err, req, res, next) => {
    res.render("listings/error.ejs", {err});
});

// SERVER STARTING ROUTE
app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});