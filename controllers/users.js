const User = require("../models/users.js");
const passport = require("passport");

module.exports.renderRegister = (req, res) => {
    res.render("users/register.ejs");
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req, res, next) => {
    req.flash("success", "Welcome back to wanderlust!");
    res.redirect("/listings");
};

module.exports.logout = async (req, res, next) => {
    req.logout(function (err) {
    if(err) {
      return next(err);
    }
    req.flash("success", "you are logged out!");
    res.redirect("/listings");
  });
};