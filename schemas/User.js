const mongoose = require("mongoose");
const CommentSchema = mongoose.Schema({
	username: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	content: String,
});
const schemaCommonProperties = {
	type: String,
	required: true,
	default: "Something",
	immutable: false,
	min: 1, // Minimum value
	max: 99, // Maximum value
	minLength: 24,
	validate: {
		validator: (x) => {
			return x % 2 == 0;
		},
		message: "Number's not even. ",
	},
	unique: true, // Unique
	// Suponiendo que existe una colección "Padres"
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Parent", // Nombre del modelo relacionado
	},
	comments: [CommentSchema],
};

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	age: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	birth: {
		type: Date,
		required: true,
		default: () => Date.now(),
	},
	bestFriend: {
		type: mongoose.SchemaTypes.ObjectId,
		required: false,
	},
});

userSchema.methods.sayHi = function () {
	console.log(`Hi! My name's ${this.name}`);
};

module.exports = mongoose.model("User", userSchema);
