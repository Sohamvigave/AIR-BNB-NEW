const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users.js");

router.get("/register", users.renderRegister );

router.post("/register", users.register);

router.get("/login", users.renderLogin);

router.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  users.login
);

router.get("/logout", users.logout);

module.exports = router;