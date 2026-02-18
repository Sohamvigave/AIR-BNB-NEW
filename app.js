require('dotenv').config();
const express = require("express");

const port = process.env.PORT || 3000;
const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

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

app.set("trust proxy", 1);

const expressSession = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
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
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

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
    await mongoose.connect(MONGODB_URI);
};

main()
.then(res => {
    console.log("connection successful");
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
    const {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
});

// SERVER STARTING ROUTE
app.listen(port,(req, res) => {
    console.log(`listening on ${port}`);
});