const express = require("express");
const authToken = require("../config/authToken");
const db = require("../config/db");
const router = express.Router();

// Routes
// Get all post
router.get("/", authToken, (req, res) => {
  // Query all pc
  db.query(
    `SELECT a.id, a.build_name, a.description, c.name as user, a.created_at, COUNT(b.user_id) as likes
    FROM pc_builds a
    LEFT JOIN likes b ON a.id = b.pc_build_id
    INNER JOIN users c ON a.user_id = c.id
    GROUP BY a.id`,
    (error, builds) => {
      if (error) throw error;
      res.status(200).json(builds);
    }
  );
});

// Get images from a post
router.get("/:id/images", authToken, (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM pc_images WHERE pc_build_id = ?",
    id,
    (error, result) => {
      if (error) throw error;
      let arr = [];
      for (const img of result) {
        arr.push({
          id: img.id,
          img: `/public/${img.pc_build_id}/images/${img.picture_src}`,
        });
      }
      res.status(200).json(arr);
    }
  );
});

// Post a PC Build/Set-up
router.post("/new", authToken, (req, res) => {
  const { name, desc, user_id } = req.body;
  db.query(
    "INSERT INTO pc_builds (build_name, description, user_id) VALUES (?, ?, ?)",
    [name, desc, user_id],
    (error, result) => {
      if (error) throw error;
      if (result) res.status(200).json({ error: false, msg: "Posted!" });
    }
  );
});

// Add images from a post
router.post("/add_images", authToken, (req, res) => {
  const { id } = req.body;
  const image = req.files.image;

  image.mv(`./public/${id}/images/${image.name}`);
  db.query(
    "INSERT INTO pc_images (picture_src, pc_build_id) VALUES (?, ?)",
    [image.name, id],
    (error, result) => {
      if (error) throw error;
      if (result)
        res.status(200).json({
          error: false,
          image: `/public/${id}/images/${image.name}`,
          msg: "Uploaded!",
        });
    }
  );
});

module.exports = router;
