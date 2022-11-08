const mongoose = require("mongoose");

const chatroomSchema = mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false,
  },
  participants: [
    {
      participantId: {
        type: mongoose.Types.ObjectId,
        required: ture,
        ref: "User",
      },
      isAdmin: {
        type: Boolean,
        default: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const Chatroom = new mongoose.model("Chatroom", chatroomSchema);
module.exports = Chatroom;
