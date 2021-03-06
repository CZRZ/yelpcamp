var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../public/javascripts/models/campground");
var Comment = require("../public/javascripts/models/comment");
var middleware = require("../middleware");

//comments.js route
// isLoggedIn is the middleware to make sure that only users who login can comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});


router.post("/", middleware.isLoggedIn, function (req, res) {
    //find by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campground");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Comment create went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //console.log(campground);
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    })
});


router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back")
        } else {
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if (err) {
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
});

router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    })
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            // send to show page
            req.flash("success", "Comment deleted");
            res.redirect("/campground/" + req.params.id);
        }
    })
});

module.exports = router;