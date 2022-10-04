const config = require("config");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("debug")("app:startup");

// Initialzing express app
const app = express();

// Middlewares
app.use(cors({ origin: true })); // Allow cross origin requests
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// app.use(express.static("public")); // For serving static files
app.use(helmet()); // For security provide headers more to read on this
if (app.get("env") === "development") {
  app.use(morgan("short"));
  logger("Morgan enabled...");
} // For logging
// Routes

logger("Application Name: " + config.get("name"));
logger("Mail Host: " + config.get("mail.host"));
logger("Mail Password: " + process.env.lancer_password);

mongoose.connect(`${process.env.MONGODB_URL}`, () => {
  logger("Connected to MongoDB");
});
const port = process.env.PORT || 6000;
app.listen(port, () => console.log(`Server started on port ${port}`));
