const mongoose = require("mongoose");
const participantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  muted: {
    type: Boolean,
    default: false,
  },
  lastVisited: {
    type: Date,
    default: Date.now,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Spam", "Abuse", "FakeAccount", "Other"],
  },
  description: {
    type: String,
    required: function () {
      return this.type === "Other";
    },
    default: "",
  },
  reportedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
});

const chatroomSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false,
  },
  participants: [participantSchema],
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
    validator: (value) => {
      if (this.Chatroom.isGroup) {
        return value.length > 0;
      }
    },
  },
  description: {
    type: String,
    default: "",
  },
  latestMessage: {
    type: mongoose.Types.ObjectId,
    ref: "Message",
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  state: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  isCustomerSupport: {
    type: Boolean,
    default: false,
  },
  reports: [reportSchema],
  reportCount: {
    type: Number,
    default: 0,
  },
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);
const Participant = mongoose.model("Participant", participantSchema);
const Report = mongoose.model("Report", reportSchema);
module.exports = { Chatroom, Participant, Report };
