"use strict";
require("dotenv").config();
const { MongoClient } = require("mongodb");

let dbConnection;
const atlasConnectionString = process.env.MONGODB_CONNECTION_STRING;
const connectToDB = (cb) => {
	MongoClient.connect(atlasConnectionString)
		.then((client) => {
			dbConnection = client.db();
			return cb();
		})
		.catch((err) => {
			console.error(err);
			return cb(err);
		});
};

const getDB = () => dbConnection;

module.exports = {
	connectToDB,
	getDB,
};
