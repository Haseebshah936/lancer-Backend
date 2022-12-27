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
  extras: {
    type: Array,
    default: [],
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
  details: {
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
  createdAt: {
    type: Date,
    default: Date.now,
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
    enum: ["seller", "customerSupport"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const requirementSchema = new mongoose.Schema({
  state: {
    type: String,
    default: "pending",
    enum: ["pending", "delivered", "provided"],
  },
  require: {
    type: String,
    default: "",
  },
  files: [
    {
      type: String,
      default: "",
    },
  ],
  links: [
    {
      type: String,
      default: "",
    },
  ],
  details: {
    type: String,
    default: "",
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
  },
  description: {
    type: String,
  },
  budget: {
    type: Number,
    required: true,
  },
  pricingType: {
    type: String,
    required: true,
    default: "fixed",
    enum: ["fixed", "hourly", "biding"],
  },
  days: {
    type: Number,
    required: true,
    default: 1,
  },
  experties: {
    type: Array,
    default: [],
  },
  files: {
    type: Array,
    default: [],
    validator: function (v) {
      if (v?.length !== undefined) {
        return true;
      }
    },
    message: "files must be an array",
  },
  links: {
    type: Array,
    default: [],
    validator: function (v) {
      if (v?.length !== undefined) {
        return true;
      }
    },
    message: "links must be an array",
  },
  state: {
    type: String,
    default: "pending",
    required: true,
    enum: [
      "pending",
      "requirementGathering",
      "onGoing",
      "delivered",
      "revision",
      "extended",
      "disputed",
      "cancelled",
      "completed",
    ],
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
  proposalCount: {
    type: Number,
    default: 0,
  },
  proposals: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  revisionsAllowed: {
    type: Number,
    default: Infinity,
  },
  revisionCount: {
    type: Number,
    default: 0,
  },
  requirenments: [requirementSchema],
});

const Hiring = mongoose.model("Hiring", hiringSchema);
const Delivery = mongoose.model("Delivery", deliverySchema);
const Extension = mongoose.model("Extension", extensionSchema);
const Cancellation = mongoose.model("Cancellation", cancellationSchema);
const Requirenment = mongoose.model("Requirement", requirementSchema);
const Project = mongoose.model("Project", projectSchema);
module.exports = {
  Hiring,
  Delivery,
  Extension,
  Cancellation,
  Requirenment,
  Project,
};
