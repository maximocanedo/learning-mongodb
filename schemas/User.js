const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: String,
	age: Number,
	email: String,
	birth: Date,
	bestFriend: mongoose.SchemaTypes.ObjectId,
});

module.exports = mongoose.model("User", userSchema);
