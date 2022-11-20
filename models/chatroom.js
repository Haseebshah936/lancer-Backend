const mongoose = require("mongoose");

const chatroomSchema = mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  groupName: {
    type: String,
  },
  description: {
    type: String,
    default: "",
  },
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);
module.exports = Chatroom;
