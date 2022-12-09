const mongoose = require("mongoose");

const customerSupportSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Types.Array.objectId,
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
  deputeReason: {
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
    enum: ["pending", "resolved", "inProgress"],
    default: "pending",
  },
  projectId: {
    type: mongoose.Types.Array.objectId,
    ref: "Project",
    required: function () {
      return this.requestType === "dispute";
    },
  },
  handlerId: {
    type: mongoose.Types.Array.objectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  solvedAt: {
    type: Date,
    default: Date.now,
  },
  converationId: {
    type: mongoose.Types.Array.objectId,
    ref: "Chatroom",
    required: function () {
      return this.handlerId !== null;
    },
  },
});

const CustomerSupport = mongoose.model(
  "CustomerSupport",
  customerSupportSchema
);
module.exports = CustomerSupport;
