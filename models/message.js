const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  chatroomId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Chatroom",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
  uri: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
