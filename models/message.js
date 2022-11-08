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

const Message = new mongoose.model("Message", messageSchema);
module.exports = Message;
