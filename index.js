"use strict";
const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDB, getDB } = require("./db");
const routes = require("./endpoints/index.js");

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
	}
});

// Routes
app.use("/users", routes.users);
app.use("/books", routes.books);
