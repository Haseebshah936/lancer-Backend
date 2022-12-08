const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
  },
  budget: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    default: "active",
    enum: ["active", "rejected", "accepted", "cancelled"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;
