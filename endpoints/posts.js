"use strict";
const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { Mongoose, ObjectId } = require("mongoose");
const Post = require("../schemas/Post");

router.use(express.json());
router.use(cookieParser());

router.post("/create", async (req, res) => {
	try {
		const { username, content } = req.body;
		const creationDate = Date.now();
		const obj = new Post({
			username,
			content,
			creationDate,
		});
		const savedStatus = await obj.save();
		res.status(201).json(savedStatus);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/:username", async (req, res) => {
	const { username } = req.body;
	try {
		const posts = await Post.find({ username });
		res.status(200).json({ posts });
	} catch (err) {
		res.status(500).json(err);
	}
});

/* router.get("/protected", async (req, res) => {
	// Check if the user's session cookie exists
	if (!req.cookies.userSession) {
		return res.status(401).json({ message: "Non-Authorized" });
	}
	// Create a new ObjectId from the user's session cookie
	const uid = req.cookies.userSession;

	let user = await User.findById(uid).select("-password");

	// If the cookie exists, the user is logged in
	res.status(200).json({
		message: "Logged in successfully",
		userID: req.cookies.userSession,
		user,
	});
});

router.get("/:username", async (req, res) => {
	try {
		const username = req.params.username;
		let user = await User.findOne({ username }, { password: 0 });
		if (!user) {
			res.status(404).json({
				message: "User not found. ",
			});
			return;
		}
		res.status(200).json(user);
		return;
	} catch (e) {
		console.log({ e });
		res.status(500).json({
			message: "An error occured. ",
		});
		return;
	}
});
*/
module.exports = router;
