const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require("mongodb");
const bookSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		minLength: 1,
	},
	author: {
		type: String,
		required: false,
		default: "Unknown",
	},
	rating: {
		type: Number,
		required: false,
		min: 0,
		max: 10,
		default: 0,
	},
	pages: {
		type: Number,
		required: false,
		min: 3,
		default: 3,
	},
	genres: [
		{
			type: String,
			required: false,
			minlength: 1,
		},
	],
	reviews: [
		{
			name: {
				type: String,
				required: true,
				minlength: 3,
				maxlength: 16,
			},
			content: {
				type: String,
				required: true,
				minlength: 3,
				maxlength: 128,
			},
		},
	],
});
bookSchema.statics.list = function ({ page, booksPerPage }) {
	return this.find() // Usar `find()` para obtener una instancia de Query
		.sort({ author: 1 })
		.skip(page * booksPerPage)
		.limit(booksPerPage)
		.exec() // Ejecutar la consulta
		.then((books) => {
			return {
				books,
				status: 200,
				error: null,
				msg: "",
			};
		})
		.catch((err) => {
			return {
				books: [],
				status: 500,
				error: err,
				msg: "Could not fetch the documents. ",
			};
		});
};
bookSchema.statics.listOne = function (id) {
	return this.find({ _id: new ObjectId(id) })
		.exec() // Ejecutar la consulta
		.then((book) => {
			return {
				book,
				status: 200,
				error: null,
				msg: "",
			};
		})
		.catch((err) => {
			return {
				book: [],
				status: 500,
				error: err,
				msg: "Could not fetch the documents. ",
			};
		});
};
module.exports = mongoose.model("Book", bookSchema);
