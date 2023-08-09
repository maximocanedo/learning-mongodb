const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db");

const router = express.Router();
//const db = await getDB();

router.get("/", (req, res) => {
	// Implementación de la ruta GET /users/
	res.status(418).json({
		ok: 200,
	});
});

module.exports = router;
