const mysql = require("mysql2");

// Create connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DB,
});

module.exports = db;