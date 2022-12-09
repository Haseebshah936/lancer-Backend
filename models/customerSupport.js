const mongoose = require("mongoose");

const customerSupportSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    enum: ["refund", "dispute", "aptitudeTest", "other"],
    required: true,
  },
  request: {
    type: String,
    required: function () {
      return this.requestType === "other";
    },
  },
  disputeReason: {
    type: String,
    required: function () {
      return this.requestType === "dispute";
    },
  },
  category: {
    type: String,
    required: function () {
      return this.requestType === "apptitudeTest";
    },
  },
  state: {
    type: String,
    enum: ["pending", "resolved", "active"],
    default: "pending",
  },
  projectId: {
    type: mongoose.Types.ObjectId,
    ref: "Project",
    required: function () {
      return this.requestType === "dispute";
    },
  },
  resolvers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: Date.now,
  },
  chatroomId: {
    type: mongoose.Types.ObjectId,
    ref: "Chatroom",
    required: function () {
      return this.handlerId?.length > 0;
    },
    default: null,
  },
});

const CustomerSupport = mongoose.model(
  "CustomerSupport",
  customerSupportSchema
);
module.exports = CustomerSupport;
