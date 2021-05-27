var mongoose = require("mongoose");
// SCHEMA SETUP
var bookSchema = new mongoose.Schema({
	customer: String,
	contact: Number,
	address: String,
	email: String,
	location: String,
	price: Number,
	total_price: Number,
	people: Number,
	event_date: Date,
	date: {type:Date, default:Date.now},
	image: String

});

module.exports = mongoose.model("Bookings", bookSchema);


