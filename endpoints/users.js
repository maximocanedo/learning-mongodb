const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("../db");

const User = require("./../schemas/User");

connectToDB((err) => {
	if (!err) {
		console.log(200);
	}
});

const router = express.Router();

router.get("/", (req, res) => {});

router.post("/", (req, res) => {
	const data = req.body;
	try {
		const user1 = new User(data);
		user1.sayHi();
		user1.save();
		res.status(201).json(user1);
	} catch (err) {
		res.status(400).json({ err: err.message });
		console.error(err);
	}
});

module.exports = router;
