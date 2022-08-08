const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/codial_devlopment");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in connecting to database"));
db.once("open", console.log.bind(console, "Database is connected successfully"));

module.exports = db;