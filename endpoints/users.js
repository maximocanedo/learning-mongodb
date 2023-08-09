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
//const db = await getDB();

router.get("/", (req, res) => {
	// Implementación de la ruta GET /users/
	res.status(418).json({
		ok: 200,
	});
});

router.post("/", (req, res) => {
	const data = req.body;
	const user1 = new User(data);
	user1.save().then((e) => {
		res.status(201).json(e);
	});
});

module.exports = router;
