const moongose = require("mongoose");

const callSchema = new moongose.Schema({
  chatroomId: {
    type: moongose.Types.ObjectId,
    ref: "Chatroom",
    required: true,
  },
  state: {
    type: String,
    enum: ["pending", "accepted", "rejected", "ended", "missed"],
    default: "pending",
  },
  callerId: {
    type: moongose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: moongose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offer: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: function () {
      return this.state === "accepted";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ["audio", "video"],
  },
  endedAt: {
    type: Date,
  },
  connectTries: {
    type: Number,
    default: 0,
  },
  reconnectTries: {
    type: Number,
    default: 0,
  }
});
const Call = moongose.model("Call", callSchema);
module.exports = Call;
