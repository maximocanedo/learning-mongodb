const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const postSchema = mongoose.Schema({
	username: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		match: /^[a-zA-Z0-9_]{3,16}$/,
		unique: true,
	},
	content: String,
	creationDate: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

postSchema.statics.getPostsFromUser = async function (username) {
	const user = await this.find({ username: username });
	console.log({ usernameAvailable: user });
	return user == 0;
};

module.exports = mongoose.model("Post", postSchema);
