const mongoose = require("mongoose");
const logger = require("../utils/logger").logger;

mongoose.connect(`${process.env.MONGODB_URL}`, () => {
    logger("Connected to MongoDB");
  });