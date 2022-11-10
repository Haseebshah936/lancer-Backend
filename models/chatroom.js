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
  participant: {
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

module.exports = new mongoose.model("Chatroom", chatroomSchema);
module.exports = new mongoose.model("Participant", participantSchema);
