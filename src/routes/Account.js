const express = require("express");
const router = express.Router();
const bc = require("bcrypt");
const db = require("../config/db");
const res = require("express/lib/response");
const salt = bc.genSaltSync(10);
const jwt = require("jsonwebtoken");
const authToken = require("../config/authToken");

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
      return callback(result);
    }
  );
};

// Generate access token
const genToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET);
};

// ROUTERS
// User registration
router.post("/register", (req, res) => {
  const { name, username, password } = req.body;

  isExist(username, (result) => {
    if (result.length === 0) {
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
          const token = genToken(username);
          res
            .status(200)
            .json({ error: false, msg: "Account registered", token });
        }
      );
    } else {
      res.status(200).json({ error: true, msg: "User already exist" });
    }
  });
});

// User login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  isExist(username, (result) => {
    if (result.length === 0) {
      res.status(200).json({
        error: true,
        msg: "User does not exists. Please create a new account or check your username.",
      });
    } else {
      if (bc.compareSync(password, result[0].password)) {
        const token = genToken(username);
        res.status(200).json({ error: false, msg: "Logged in", userId: result[0].id, token });
      } else {
        res.status(200).json({
          error: true,
          msg: "Password is incorrect.",
        });
      }
    }
  });
});

// Get account info
router.get("/:id", authToken, (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (error, result) => {
    if (error) throw error;
    res.status(200).json(result[0]);
  });
});

module.exports = router;
