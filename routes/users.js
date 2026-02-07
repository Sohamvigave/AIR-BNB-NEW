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
  
    res.status(201).send("User registered successfully!");

  } catch(err) {
    res.status(400).send(err.message);
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login",
  passport.authenticate("local", {
    failureMessage: true
  }),
  (req, res) => {
    res.send("login successfully");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if(err) {
      return next(err);
    }
    res.send("Logged out successfully");
  });
});

module.exports = router;