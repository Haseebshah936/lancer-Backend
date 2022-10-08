require("./db/connectDB");
const config = require("config");
const morgan = require("./utils/morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/auth");
const { logger } = require("./utils/logger");


// Initialzing express app
const app = express();

// Middlewares
app.use(helmet()); // For security provide headers more to read on this
app.use(cors({ origin: true })); // Allow cross origin requests
app.use(express.json()); // For parsing application/json

// app.use(express.static("public")); // For serving static files



// Calling Morgan
morgan(app);

// Routes
app.use("/api/auth", authRouter);
app.get("/api/", (req, res) => {
  res.send("Hello World");
});

// Started Server
// const port = process.env.PORT || 3002;
const port = config.get("port");
app.listen(port, () => logger(`Server started on port ${port}`));
