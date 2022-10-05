const mongoose = require("mongoose");
const config = require("config");
const logger = require("../utils/logger").logger;



mongoose.connect(`mongodb+srv://${config.get("mongoDB.name")}:${config.get("mongoDB.password")}@cluster0.ubrhyli.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    logger("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
})