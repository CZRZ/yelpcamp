var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./public/javascripts/models/campground.js"),
    Comment = require("./public/javascripts/models/comment.js"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrtegy = require("passport-local"),
    User = require("./public/javascripts/models/user"),
    seedDB = require("./public/javascripts/seeds.js"),
    flash = require("connect-flash");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//seedDB();
mongoose.connect("mongodb+srv://dbUser:<dbCzrz>@cluster0-fok4b.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    userCreateIndex: true
}).then( () =>{
    console.log("connect to db");
}).catch(err => {
    console.log("error", err.message);
});

//passport configuration
app.use(require("express-session")({
    secret: "Glory be to Him, who endureth forever, and in whose hand are the keys of unlimited Pardon and unending Punishment.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
passport.use(new LocalStrtegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(function (req, res, next) {
    //currentUser is req.user when is needed so
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/campground/:id/comments", commentRoutes);
app.use("/campground", campgroundRoutes);

module.exports = app;
