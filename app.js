//packages 
var express = require("express"),
	app = express(),
	ejs = require("ejs"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy =require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	Event = require("./models/events"),
	Comment = require("./models/comment"),
	Trek  = require("./models/trek"),
	User = require("./models/user"),
	seedDB = require("./seeds");

//routes
var eventRoutes = require("./routes/events"),
	commentRoutes = require("./routes/comments"),
	authRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/peak-seekers");

// APP CONFIGURATION
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")); //calling path for directory
app.use(methodOverride("_method"));
app.use(flash());

// // GETTING CURRENT USER FOR SHOWING IF LOGGED IN OUR NOT
// app.use(function(req, res, next){
// 	res.locals.currentUser = req.user;
// 	next();
// });


// seedDB(); // seed the database

//=========== PASSPORT CONFIGURATION ===========
app.use(require("express-session")({
	secret: "This is a Secret Text", //decode and encode
	resave: false,
	saveUninitialized:false
}));

//ask node to use passsport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //for encoding
passport.deserializeUser(User.deserializeUser()); //for decoding


//route
app.use(eventRoutes);
app.use(commentRoutes);
app.use(authRoutes);



//MIDDLEWARE
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}


//port
app.listen(1080, function(err){
	if (err){
		console.log(err);
	} else{
		console.log("Server has started on port 1080...");
	}
});