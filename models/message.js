const mongoose = require("mongoose");

const message = mongoose.Schema({
  chatroomId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "chatroom",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  messageType: {
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
});

const Message = new mongoose.model("Message", message);
module.exports = Message;
