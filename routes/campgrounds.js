var express = require("express");
var router = express.Router();
var Campground = require("../public/javascripts/models/campground");

router.get("/", function (req, res) {
    //res.render("campground",{campground:campground});
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campground: allCampgrounds});
        }
    })
});

router.post("/", isLoggedIn, function (req, res) {
    //get data from form
    //add data to campground array
    //redirect to campground page
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
    //campground.push(newCampground);
    //create a new campground and save it to the database
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campground");
        }
    })
});

//sequence is important, new must be ealier than :id
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampGround) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampGround);
            res.render("campgrounds/show", {campground: foundCampGround});
        }
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;