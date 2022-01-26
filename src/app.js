require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT;
const fileUpload = require("express-fileupload");

// Express
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors
app.use(cors());

// File upload
app.use('/public', express.static('public'));
app.use(fileUpload({ createParentPath: true }));

// Routers
const Account = require("./routes/Account");
const Post = require("./routes/Post");

// Routes
app.use("/account", Account);
app.use("/posts", Post);

// Port
app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
