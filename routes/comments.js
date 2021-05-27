var express = require("express");
var router = express.Router();
var Event = require("../models/events");
var Comment = require("../models/comment");
// ==================================
//          COMMENTS ROUTES
// ==================================

router.get("/events/:id/comments/new", isLoggedIn, function(req,res){
	//find by id
	Event.findById(req.params.id, function(err, event){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {event:event, currentUser:req.user});
		}
	});
});

router.post("/events/:id/comments",isLoggedIn, function(req, res){
	//lookup events using id
	Event.findById(req.params.id, function(err, event){
		if(err){
			console.log(err);
			res.redirect("/events/events");
		}
		else{
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//connect new comment to events
					event.comments.push(comment);
					event.save();
					console.log(comment);
					//redirect to events show page
					res.redirect("/events/"+ event._id);
				}
			});
		}
	});
});


// //COMMENT EDIT ROUTE TO SHOW FORM
// router.get("/events/:id/comments/:comment_id/edit", function(req,res){
// 	Comment.findById(req.params.comment_id, function(err, foundComment){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			res.render("comments/edit", {currentUser:req.user, event_id:req.params.id, comment:foundComment, comment_id:req.params.comment_id});
// 		}
// 	});
// });

// //COMMENT UPDATE TO POST ON PAGE
// router.put("/events/:id/comments/:comment_id", function(res, req){
// 	Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment, function(err, updatedComment){
// 		if(err){
// 			console.log(err); 
// 			res.redirect("back");
// 		}
// 		else
// 		{
// 			res.redirect("/events/" +req.params.id);
// 		}
// 	});
// });

//MIDDLEWARE
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login first");
	res.redirect("/login");
}


module.exports = router;