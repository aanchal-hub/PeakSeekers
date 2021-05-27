var express = require("express");
var router = express.Router();
var Event = require("../models/events");
var Comment = require("../models/comment");
var Trek = require("../models/trek");
var User = require("../models/user");
var Booking = require("../models/bookings");

var passport = require("passport");

//middleware to check if the user is admin
router.get("/check" , function(req, res){
	if (req.user.username === "Admin"){
		res.redirect("/admin/admin");
	}
	else
	{
		res.redirect("/");
	}
});


// HOMEPAGE
router.get("/", function(req, res){
	Trek.find({}, function(err, allEvents){
		if(err){
			console.log(err);
		}
		else{
			res.render("events/index", {data: allEvents, currentUser:req.user});
		}
	});
});

// AUTH ROUTES

// DISPLAY REGISTER 
router.get("/register", function(req,res){
	res.render("events/register", {currentUser:req.user});
});

// HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
	var newUser = req.body.username;
	var newEmail = req.body.email;
	var newContact = req.body.contact;
	var newRegister = {username:newUser, email:newEmail, contact:newContact};
	console.log(newRegister);
	User.register(newRegister, req.body.password, function(err, user){
		if(err){
			console.log("error: "+err);
			return res.render("events/index");
		}
		else{
				passport.authenticate("local")(req, res, function(){5
				res.redirect("/check");
				console.log("registration successful");
			});
		}
	});
});

// SHOW LOGIN PAGE
router.get("/login", function(req,res){
	res.render("events/login", {currentUser:req.user, message: req.flash("error")});
});

// LOGIN INTO SYSTEM
router.post("/login" , passport.authenticate("local",
	{
		successRedirect:"/check",  //"/check",
		failureRedirect:"/login"
	}), function(req, res ){

});

// LOGIC ROUTE
// LOGOUT 
router.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});

//MIDDLEWARE
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login first");
	res.redirect("/login");
}


// ERROR HANDLER
router.get("*" , function(req, res){
	res.send("oops! ERROR");
});

module.exports= router;