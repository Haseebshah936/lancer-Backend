const mongoose = require("mongoose");

const customerSupportSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  details: {
    type: String,
  },
  isCustomerSupport: {
    type: Boolean,
    default: false,
  },
  requestType: {
    type: String,
    enum: ["dispute", "aptitudeTest", "other"],
    required: true,
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
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
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
  resolvedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
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
