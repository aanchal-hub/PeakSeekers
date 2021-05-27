var mongoose = require("mongoose");
var Event = require("./models/events");
var Comment = require("./models/comment");
var data =[
	{
		name:"Cloud's Rest",
		image:"https://images.unsplash.com/photo-1591534013505-9fa6ce4fa654?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdWQlMjBoaWxsc3xlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		description:"Cloudy cloudy hills...."
	},
	{
		name:"Bayou",
		image:"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8d29vZHN8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		description:"Into the woods..."
	},
	{
		name:"Laky lake",
		image:"https://images.unsplash.com/photo-1536084970624-b275a6a11673?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFrZXNpZGV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
		description:"Calming Lakeside..."
	}
];

function seedDB() {
	//remove all events
	Event.remove({}, function(err){
		if(err){
		console.log(err);
		}
		else{
		console.log("removed event!");
		}
	});
	//add few events
	data.forEach(function(seed){
		Event.create(seed, function(err, event){
			if(err){
				console.log(err);
			}
			else{
				console.log("added an event");
				//create a comment
				Comment.create(
					{
						text:"this place is awesome...",
						author:"ryan"	
					}, function(err, comment){
						if(err){
							console.log(err);
						}
						else{
							event.comments.push(comment);
							event.save();
							console.log("created a new comment");
							}
						}
					);
				}
			});  
		});
}



module.exports = seedDB;