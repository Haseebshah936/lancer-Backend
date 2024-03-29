require("./db/connectDB");
const config = require("config");
const morgan = require("./utils/morgan");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/auth");
const { logger } = require("./utils/logger");
const user = require("./routes/user");
const category = require("./routes/category");
const gig = require("./routes/gig");
const product = require("./routes/product");
const message = require("./routes/message");
const chatroom = require("./routes/chatroom");
const review = require("./routes/review");
const proposal = require("./routes/proposal");
const project = require("./routes/project");
const customerSupport = require("./routes/customerSupport");
const invoice = require("./routes/invoice");
const meetingGenerator = require("./utils/meetingGenerator");
const meeting = require("./routes/meeting");
const call = require("./routes/call");
const view = require("./routes/view");
const favorite = require("./routes/favorite");
const notification = require("./routes/notification");
const withdrawal = require("./routes/withdrawal");
// Initialzing express app
const app = express();

// Middlewares
app.use(helmet()); // For security provide headers more to read on this
app.use(cors({ origin: true })); // Allow cross origin requests
app.use(express.json({ limit: "300KB" })); // For parsing application/json
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(express.static("public")); // For serving static files

// Calling Morgan
morgan(app);

// MeetingGenerator
meetingGenerator(app);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", user);
app.use("/api/category", category);
app.use("/api/gig", gig);
app.use("/api/product", product);
app.use("/api/message", message);
app.use("/api/chatroom", chatroom);
app.use("/api/review", review);
app.use("/api/proposal", proposal);
app.use("/api/project", project);
app.use("/api/customerSupport", customerSupport);
app.use("/api/invoice", invoice);
app.use("/api/meeting", meeting);
app.use("/api/call", call);
app.use("/api/view", view);
app.use("/api/favorite", favorite);
app.use("/api/notification", notification);
app.use("/api/withdrawal", withdrawal);
app.get("/api/", (req, res) => {
  res.send("Hello World");
});

// Started Server
// const port = process.env.PORT || 3002;
const port = config.get("port");
app.listen(port, () => logger(`Server started on port ${port}`));

// const http = require("http");
// const app1 = http.createServer((req, res) => {
//   res.end(req.body?.offer);
// });

// app1.listen(3004, () => {
//   console.log("Server is running on port 3004");
// });
