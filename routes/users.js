const express = require("express");
const router = express.Router();
const User = require("../models/users");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post("/register", async (req, res) => {
  try {
    const {email, username, password} = req.body;
    
    const newUser = User({email, username});
    
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });

  } catch(err) {
    req.flash("error", err.message);
    res.redirect("/users/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    res.redirect("/listings");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if(err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;