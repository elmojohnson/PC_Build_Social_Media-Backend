const mysql = require("mysql2");

// Create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "pc_build_db",
});

module.exports = db;