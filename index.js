"use strict";
const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("./db");

// Initialize
const app = express();

app.use(express.json());

let db;

// DB Connection
connectToDB((err) => {
	if (!err) {
		app.listen(3000, () => {
			console.log("App listening...");
		});
		db = getDB();
	}
});
// Routes
app.get("/books", (req, res) => {
	const page = req.query.p || 0;
	const booksPerPage = 2;

	let books = [];
	db.collection("books")
		.find() // Cursor toArray forEach
		.sort({ author: 1 })
		.skip(page * booksPerPage)
		.limit(booksPerPage)
		.forEach((book) => books.push(book))
		.then(() => {
			res.status(200).json(books);
		})
		.catch((err) => {
			res.status(500).json({
				error: "Could not fetch the documents. ",
				details: err,
			});
		});
});

app.get("/books/:id", (req, res) => {
	let id = req.params.id;
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			msg: "The ID is not valid",
		});
		return;
	}
	db.collection("books")
		.findOne({ _id: new ObjectId(id) })
		.then((doc) => {
			res.status(200).json(doc);
		})
		.catch((err) => {
			res.status(500).json({
				msg: "Could not fetch the specified documents. ",
				err,
			});
		});
	return;
});
app.post("/books", (req, res) => {
	const book = req.body;
	db.collection("books")
		.insertOne(book)
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});
app.delete("/books/:id", (req, res) => {
	let id = req.params.id;
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			msg: "The ID is not valid. ",
		});
		return;
	}
	db.collection("books")
		.deleteOne({ _id: new ObjectId(id) })
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});
app.patch("/books/:id", (req, res) => {
	let id = req.params.id;
	const updates = req.body;
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			msg: "The ID is not valid. ",
		});
		return;
	}
	db.collection("books")
		.updateOne({ _id: new ObjectId(id) }, { $set: updates })
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});
