const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
	min: 1,
	max: 99,
	minLength: 24,
	validate: {
		validator: (x) => {
			return x % 2 === 0;
		},
		message: "Number's not even.",
	},
	unique: true,
	parent: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Parent",
	},
	comments: [CommentSchema],
};

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		match: /^[a-zA-Z0-9_]{3,16}$/,
		unique: true,
	},
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
		default: Date.now,
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
	},
});

userSchema.methods.sayHi = function () {
	console.log(`Hi! My name's ${this.name}`);
};

const hashPassword = async (password) => {
	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(this.password, saltRounds);
		return {
			password: hashedPassword,
			error: null,
		};
	} catch (error) {
		return {
			password: null,
			error,
		};
	}
};

// Agregamos un hook para hash y salt de la contraseña antes de guardar el usuario
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(this.password, saltRounds);
		console.log({ hashedPassword });
		this.password = hashedPassword;
		next(); // Llamamos a next() sin await
	} catch (error) {
		return next(error);
	}
});

userSchema.statics.isUsernameAvailable = async function (username) {
	const user = await this.find({ username }).count();
	console.log({ usernameAvailable: user });
	return user == 0;
};
// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
	try {
		console.log({ legacyPassword: this.password, password });
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw error;
	}
};

module.exports = mongoose.model("User", userSchema);
