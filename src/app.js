require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT;

// Express
const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors
app.use(cors());

// Routers
const Account = require("./routes/Account");

// Routes
app.use("/account", Account);

// Port
app.listen(PORT, () =>
  console.log(`App is running on http://localhost:${PORT}`)
);
