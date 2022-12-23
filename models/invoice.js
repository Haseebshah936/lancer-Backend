const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Project",
  },
  freelancerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  employerId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ["creditCard", "bankTransfer", "wallet", "JazzCash", "EasyPaisa"],
    required: true,
  },
  invoiceStatus: {
    type: String,
    enum: ["pending", "recieved", "paid", "cancelled", "refunded", "failed"],
    default: "pending",
  },
  paymentDate: {
    type: Date,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentNote: {
    type: String,
    default: "",
  },
  tip: {
    type: Boolean,
    default: false,
  },
  revision: {
    type: Boolean,
    default: false,
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
