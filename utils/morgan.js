const morgan = require("morgan");
const logger = require("../utils/logger").logger;

module.exports = function (app) {
  if (app.get("env") === "development") {
    app.use(morgan("dev"));
    logger("Morgan enabled...");
  }
};
