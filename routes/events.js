var express = require("express");
var router = express.Router();
var Event = require("../models/events");
var Comment = require("../models/comment");
var Trek  = require("../models/trek");
var Booking = require("../models/bookings");


// JS OF CALENDER


// ADMIN ROUTES
router.get("/admin/admin",isLoggedIn, function(req, res){
	// get all the events from the database
	Trek.find({}, function(err, allTreks){
		if(err){
			console.log(err);
		}
		else{
			res.render("admin/admin", {data: allTreks, currentUser:req.user});
		}
	});
	
});

// ADD NEW EVENT TO DATABASE FOR BOOKINGS
// SHOW FORM TO GET DATA
router.get("/admin/new", isLoggedIn, function(req,res){
	res.render("admin/new",{currentUser:req.user});
});

//POST DATA TO THE DATABASE
router.post("/admin", function(req, res){
	//get data from form and post to events page
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var date = req.body.date;
	var information = req.body.information;
	var newTrek = {name:name, image:image, description:description, price:price, date:date, information:information};
	//create a new event and save to database
	Trek.create(newTrek, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//redirect page to events page
			res.redirect("/admin/admin");
			console.log(newlyCreated);
			console.log("trek added successfully");
		}
	});
});

// SHOW INFORMATION ABOUT ONE SPECIFIC TREK
router.get("/admin/:id",isLoggedIn, function(req, res){
	//FIND THE EVENT WITH PROVIDED ID
		Trek.findById(req.params.id, function(err, foundTrek){
		if(err){
			res.redirect("/admin/admin");
			console.log(err);
		} else{
			//RENDER SHOW TEMPLATE WITH THAT EVENT
			console.log(foundTrek);
			res.render("admin/show", {data:foundTrek, currentUser:req.user});
		}
	});
});

// EDIT TREK ROUTE
router.get("/admin/:id/edit",isLoggedIn, function(req, res){
	Trek.findById(req.params.id, function(err, foundTrek){
		if(err){
			res.redirect("/");
		} else{
			res.render("admin/edit", {trek:foundTrek,currentUser:req.user});
		}
	});
});

// UPDATE EVENTS ROUTE
router.put("/admin/:id",isLoggedIn, function(req, res){
	//find and update the correct event
	Trek.findByIdAndUpdate(req.params.id, req.body.trek, function(err, updatedTrek){
		if (err){
			res.redirect("/admin/edit");
		} else{
			//redirect somewhere(show page)
			res.redirect("/admin/"+ req.params.id);
		}
	});
});

// DELETE A TREK ROUTE
router.delete("/admin/:id",isLoggedIn, function(req, res){
	Trek.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/");
		} else{
			res.redirect("/admin/admin");
		}
	});
});

// RECIEVE BOOKINGS ON THIS PAGE'
router.get("/admin/recieve", isLoggedIn, function(req,res){
	res.render("admin/recieve");
});

// router.get("/admin/history",isLoggedIn, function(req, res){
// 	Booking.find({}, function(err, allBookings){
// 		if (err){
// 			console.log(err);
// 		} else{
// 			res.render("admin/history", {data:allBookings, currentUser:req.user});
// 		}
// 	}).sort({date:'-1'});
// });



// =========================================================================================



// DISPLAY LIST OF ALL THE EVENTS
router.get("/events", function(req, res){
	// get all the events from the database
	Event.find({}, function(err, allEvents){
		if(err){
			console.log(err);
		}
		else{
			res.render("events/events", {data: allEvents, currentUser:req.user});
		}
	});
	
});


// DISPLAY FORM TO MAKE A NEW EVENT
router.get("/events/new", isLoggedIn, function(req,res){
	res.render("events/new",{currentUser:req.user});
});


// ADD NEW EVENT TO DATABASE
// POST REQUEST
router.post("/events", function(req, res){
	//get data from form and post to events page
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newEvent = {name:name, image:image, description:description, author:author};
	
	//create a new event and save to database
	Event.create(newEvent, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//redirect page to events page
			console.log(newlyCreated);
			console.log("ADDED A NEW EVENT");
			res.redirect("/events");
		}
	});
});

// SHOW INFORMATION ABOUT ONE SPECIFIC EVENT
// FOR BLOG PAGE
router.get("/events/:id", function(req, res){
	//FIND THE EVENT WITH PROVIDED ID
		Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
		if(err){
			res.redirect("/events/index");
			console.log(err);
		} else{
			//RENDER SHOW TEMPLATE WITH THAT EVENT
			console.log(foundEvent);
			res.render("events/show", {data:foundEvent,currentUser:req.user});
		}
	});
});


// FOR BOOKING PAGE

//SHOW SPECIFIC EVENT FOR BOOKING
router.get("/events/book/:id", function(req, res){
	//FIND THE EVENT WITH PROVIDED ID
		Trek.findById(req.params.id, function(err, foundEvent){
		if(err){
			res.redirect("/events/index");
			console.log(err);
		} else{
			//RENDER SHOW TEMPLATE WITH THAT EVENT
			console.log(foundEvent);
			res.render("events/book", {data:foundEvent,currentUser:req.user});
		}
	});
});

//SHOW FORM PAGE FOR BOOKING EVENT]
router.get("/events/book/:id/form", isLoggedIn, function(req, res){
	//show trek information
	Trek.findById(req.params.id, function(err, foundTrek){
		res.render("events/form",{data:foundTrek, currentUser:req.user});
	});
});


router.post("/events/book/:id", function(req, res){
	Trek.findById(req.params.id, function(err, foundTrek){
		var location = foundTrek.name;
		var price = foundTrek.price;
		var event_date = foundTrek.date;
		var image = foundTrek.image;

		var customer = req.body.name;
		var address= req.body.address;
		var email = req.body.email;
		var contact = req.body.contact;
		var people = req.body.people;
		var total_price = price * people;

		var newBooking = {
			location:location,
			price:price,
			event_date:event_date,
			customer:customer,
			address:address, 
			email:email, 
			contact:contact, 
			people:people,
			total_price:total_price
		};
		Booking.create(newBooking, function(err, newlyBookingDone){
			if(err){
				console.log(err);
			} 
			else{
				console.log(newlyBookingDone);
				res.render("events/confirm", {booking:newlyBookingDone, currentUser:req.user});
			}
		});
	});
});



// EDIT EVENTS ROUTE
router.get("/events/:id/edit",checkEventOwnership, function(req, res){
	Event.findById(req.params.id, function(err, foundEvent){
		res.render("events/edit", {event:foundEvent, currentUser:req.user});
	});		
	
});

// UPDATE EVENTS ROUTE
router.put("/events/:id",checkEventOwnership, function(req, res){
	//find and update the correct event
	Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
		if (err){
			res.redirect("/events/edit");
		} else{
			//redirect somewhere(show page)
			res.redirect("/events/"+ req.params.id);
		}
	});
});

// DELETE EVENT
router.delete("/events/:id",checkEventOwnership, function(req, res){
	Event.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/");
		} else{
			res.redirect("/");
		}
	});
});


// MIDDLEWARE
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login first");
	res.redirect("/login");
}

// checking ownership of the user
function checkEventOwnership(req, res, next){
	if(req.isAuthenticated()){		
		Event.findById(req.params.id, function(err, foundEvent){
			if(err){
				res.redirect("back");
			} else{
				//does user own the event blog
				if( foundEvent.author.id.equals(req.user._id))
				{
					next();
				}
				else{
					//otherwise redirect
					res.redirect("back");
				}
			}
		});
	} 
	else{
		//if not, redirect
		res.redirect("back");
	}
}

module.exports = router;