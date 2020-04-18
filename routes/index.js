var express=  require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../public/javascripts/models/user");

router.get("/", function (req, res) {
  res.render("landingpage");
});
//===============
//auth routes
router.get("/register", function (req, res) {
  res.render("register");
});

//sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    //local strategy is defined by User.authenticate
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campground");
    });
  })
});

//show login form
router.get("/login", function (req, res) {
  res.render("login");
});
//post login
//app.post("login", middleware, callback)
router.post("/login", passport.authenticate("local", {
      successRedirect: "/campground",
      failureRedirect: "/login"
    }),
    function (req, res) {
    });

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/campground");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;