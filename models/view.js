const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  viewer: {
    type: String,
    enum: ["seller", "buyer"],
    default: "buyer",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

const View = mongoose.model("View", viewSchema);
module.exports = View;
