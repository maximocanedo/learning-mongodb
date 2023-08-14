const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("../db");
const Book = require("./../schemas/Book");

const router = express.Router();
let db;
connectToDB((err) => {
	if (!err) {
		db = getDB();
	}
});

// Obtener todos los libros
router.get("/", async (req, res) => {
	const page = req.query.p || 0;
	const booksPerPage = 2;
	const books = await Book.list({
		page,
		booksPerPage,
	});
	let booksObj = books.books;
	let errorObj = {
		error: books.error,
		msg: books.msg,
	};
	let code = books.status || 200;
	res.status(code).json(books.error ? errorObj : booksObj);
});

// Obtener un libro en particular.
router.get("/:id", async (req, res) => {
	let id = req.params.id;
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			msg: "The ID is not valid",
		});
		return;
	}
	const books = await Book.listOne(id);
	let booksObj = books.book;
	let errorObj = {
		error: books.error,
		msg: books.msg,
	};
	let code = books.status || 200;
	res.status(code).json(books.error ? errorObj : booksObj);
	return;
});

// Insertar datos de un nuevo libro.
router.post("/", (req, res) => {
	const book = req.body;
	Book.create({
		...book,
	})
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// Eliminar un libro en particular.
router.delete("/:id", (req, res) => {
	let id = req.params.id;
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			msg: "The ID is not valid. ",
		});
		return;
	}
	Book.deleteOne({ _id: new ObjectId(id) })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

// Modificar los datos de un libro en particular.
router.patch("/:id", (req, res) => {
	let id = req.params.id;
	const updates = req.body;
	if (!ObjectId.isValid(id)) {
		res.status(400).json({
			msg: "The ID is not valid. ",
		});
		return;
	}
	Book.updateOne({ _id: new ObjectId(id) }, { $set: updates })
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

module.exports = router;
