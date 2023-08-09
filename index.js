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

// Obtener todos los libros
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

// Obtener un libro en particular.
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

// Insertar datos de un nuevo libro.
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

// Eliminar un libro en particular.
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

// Modificar los datos de un libro en particular.
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
