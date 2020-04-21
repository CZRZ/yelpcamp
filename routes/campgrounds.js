var express = require("express");
var router = express.Router();
var Campground = require("../public/javascripts/models/campground");
var Comment = require("../public/javascripts/models/comment");
var middleware = require("../middleware"); //index.js is required when a directory is required


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

router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form
    //add data to campground array
    //redirect to campground page
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, price: price, description: description, author: author};
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
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampGround) {
        if (err || !foundCampGround) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            // console.log(foundCampGround);
            res.render("campgrounds/show", {campground: foundCampGround});
        }
    })
});

//edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//update campgroud route
router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            res.redirect("/campground");
        } else {
            res.redirect("/campground/" + req.params.id);

        }
    })
});

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campgroundRemoved) {
        if (err) {
            res.redirect("/campground");
        } else {
            Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, function (err) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/campground");
            });
        }
    })
});


module.exports = router;