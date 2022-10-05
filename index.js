require("./db/connectDB");
const morgan = require("./utils/morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/auth");

// Initialzing express app
    const app = express();

// Middlewares
    app.use(helmet()); // For security provide headers more to read on this
    app.use(cors({ origin: true })); // Allow cross origin requests
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// app.use(express.static("public")); // For serving static files

// Calling Morgan
    morgan(app);

// Routes 
    app.use("/api/auth", authRouter)


// Started Server
    const port = process.env.PORT || 3002;
    app.listen(port, () => console.log(`Server started on port ${port}`));
