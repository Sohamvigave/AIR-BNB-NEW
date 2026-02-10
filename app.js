const express = require("express");

const port = 8080;
const app = express();
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

const passport = require("passport");
const reviewRoutes = require("./routes/reviews.js");
const localStrategy = require("passport-local");
const listingRoutes = require("./routes/listings.js");
const userRoutes = require("./routes/users.js");

const path = require("path");
const mongoose = require("mongoose");
const expressError = require("./utils/expressError.js");
const User = require("./models/users.js");

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

app.use(session(expressSession));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.static(path.join(__dirname, "public/css")));

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

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
    // console.log(req.session);
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