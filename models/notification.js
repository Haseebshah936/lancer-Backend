const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  chatroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chatroom",
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "review", "chat", "customerSupport"],
    default: "info",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.type === "chat";
    },
  },
  description: {
    type: String,
    required: function () {
      return this.type !== "chat";
    },
  },
  isRead: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
