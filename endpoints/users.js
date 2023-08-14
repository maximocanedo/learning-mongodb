"use strict";
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { Mongoose, ObjectId } = require("mongoose");
const User = require("../schemas/User");

router.use(express.json());
router.use(cookieParser());

router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const passwordMatch = await user.comparePassword(password);

		if (passwordMatch) {
			// Set cookie to store session
			res.cookie("userSession", user._id, { httpOnly: true });
			return res.status(200).json({ message: "Login successful" });
		} else {
			return res.status(401).json({ message: "Invalid credentials" });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/signup", async (req, res) => {
	try {
		// Recibir los datos.
		// Verificar si todas las propiedades requeridas están presentes en req.body
		const requiredProps = [
			"username",
			"name",
			"email",
			"birth",
			"password",
		];
		const missingProps = requiredProps.filter(
			(prop) => !(prop in req.body)
		);

		if (missingProps.length > 0) {
			return res.status(400).json({
				message: `Missing required properties: ${missingProps.join(
					", "
				)}`,
			});
		}

		let { username, name, age, email, birth, password } = req.body;
		const usernameIsAvailable = await User.isUsernameAvailable(username);
		if (!usernameIsAvailable) {
			res.json({
				message: "Username already exists",
			});
			return;
		}
		// Validar datos.
		let newUser = new User({ username, name, age, email, birth, password });
		// Guardar.
		const savedStatus = await newUser.save();
		res.status(201).json(savedStatus); // .json({...savedStatus, password: null})
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
});

router.get("/protected", async (req, res) => {
	// Check if the user's session cookie exists
	if (!req.cookies.userSession) {
		return res.status(403).json({ message: "Non-Authorized" });
	}
	// Create a new ObjectId from the user's session cookie
	const uid = req.cookies.userSession;

	let user = await User.findById(uid);

	// If the cookie exists, the user is logged in
	res.status(200).json({
		message: "Logged in successfully",
		userID: req.cookies.userSession,
		user,
	});
});

module.exports = router;
