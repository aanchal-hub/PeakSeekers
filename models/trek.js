var mongoose = require("mongoose");
// SCHEMA SETUP
var trekSchema = new mongoose.Schema({
	name: String,
	image: String,
	description:String,
	price: Number,
	date: Date,
});

module.exports = mongoose.model("Trek", trekSchema);


