const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const deliverySchema = new mongoose.Schema({
  files: [
    {
      type: String,
    },
  ],
  links: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: String,
    default: "pending",
    enum: ["pending", "rejected", "accepted"],
  },
  reason: {
    type: String,
    required: function () {
      return this.state === "rejected";
    },
  },
});

const extensionSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    default: "pending",
    enum: ["pending", "rejected", "accepted"],
  },
});

const cancellationSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  canceller: {
    type: String,
    enum: ["creator", "seller", "customerSupport"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  pricingType: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    default: "pending",
    required: true,
    enum: [
      "pending",
      "ongoing",
      "delivered",
      "revision",
      "cancelled",
      "completed",
      "deputed",
    ],
  },
  experties: {
    type: Array,
    default: [],
  },
  files: {
    type: Array,
    default: [],
  },
  links: {
    type: Array,
    default: [],
  },
  hired: {
    type: hiringSchema,
    required: function () {
      return this.state === "ongoing";
    },
  },
  delivery: [deliverySchema],
  extension: [extensionSchema],
  cancellation: {
    type: cancellationSchema,
    required: function () {
      return this.state === "cancelled";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  conversationId: {
    type: mongoose.Types.ObjectId,
    ref: "Chatroom",
  },
  startedAt: {
    type: Date,
    default: null,
  },
  completionDate: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

const Hiring = mongoose.model("Hiring", hiringSchema);
const Delivery = mongoose.model("Delivery", deliverySchema);
const Extension = mongoose.model("Extension", extensionSchema);
const Project = mongoose.model("Project", projectSchema);
module.exports = {
  Hiring,
  Delivery,
  Extension,
  Project,
};
