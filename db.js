"use strict";
require("dotenv").config();
const { MongoClient } = require("mongodb");

let dbConnection;
const atlasConnectionString = process.env.MONGODB_CONNECTION_STRING;

/// Conecta con el servidor de MongoDB.
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

/// Obtener la base de datos.
const getDB = () => dbConnection;

/// Exportando funciones.
module.exports = {
	connectToDB,
	getDB,
};
