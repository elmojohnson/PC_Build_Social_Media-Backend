const express = require("express");
const router = express.Router();
const bc = require("bcrypt");
const db = require("../config/db");
const res = require("express/lib/response");
const salt = bc.genSaltSync(10);

// FUNCTIONS
// Check existing user
const isExist = (username, callback) => {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      }

      if (result.length === 0) {
        return callback(false);
      } else {
        return callback(true);
      }
    }
  );
};

// ROUTERS
// User registration
router.post("/register", (req, res) => {
  const { name, username, password } = req.body;

  isExist(username, (result) => {
    if (!result) {
      db.query(
        "INSERT INTO users (name, username, password) VALUES (?, ?, ?)",
        [name, username, bc.hashSync(password, salt)],
        (error, result) => {
          if (error) {
            res.status(500).json({
              error: true,
              msg: "There was an error creating your account. Please try again.",
              errorMsg: error,
            });
          }
          res.status(200).json({ error: false, msg: "Account registered" });
        }
      );
    } else {
      res.status(200).json({ error: true, msg: "User already exist" });
    }
  });
});

module.exports = router;
