const Call = require("../models/call");
const Message = require("../models/message");

const getCalls = async (req, res) => {
  try {
    const calls = await Call.find().sort({
      createdAt: -1,
    });
    res.status(200).send(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id).populate(
      "callerId receiverId",
      "name profilePic isOnline"
    );
    if (!call) return res.status(404).send("No call found");
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCallsByChatroomId = async (req, res) => {
  try {
    const { id } = req.params;
    const calls = await Call.find({
      chatroomId: id,
    })
      .populate("chatroomId", "participants")
      .sort({
        createdAt: -1,
      });
    res.status(200).send(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCallsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const calls = await Call.find()
      .or([
        {
          callerId: id,
        },
        {
          receiverId: id,
        },
      ])
      .populate("chatroomId", "participants")
      .sort({
        createdAt: -1,
      });
    res.status(200).send(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCall = async (req, res) => {
  try {
    const { chatroomId, callerId, receiverId, offer, type } = req.body;
    if (!offer) throw new Error("Offer is required");

    const sameCall = await Call.findOne({
      chatroomId,
      callerId,
      receiverId,
      state: {
        $in: ["pending", "accepted"],
      },
    });
    if (sameCall) return res.status(201).send("Call already exists");
    const calls = await Call.find({
      receiverId,
      state: {
        $in: ["pending", "accepted"],
      },
      updatedAt: {
        $gt: Date.now() - 10000,
      },
    });
    if (calls.length > 0) {
      const message = Message({
        chatroomId,
        userId: callerId,
        type: "system",
        text: "Missed call from",
        uri: "",
      });
      console.log(message);
      message.save();
      return res.status(409).send("User is busy");
    }
    const call = new Call({
      chatroomId,
      callerId,
      receiverId,
      offer,
      type,
    });
    call.save();
    res.status(201).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    if (!answer) throw new Error("Answer is required");
    const call = await Call.findById(id);
    if (!call) return res.status(404).send("No call found");
    call.state = "accepted";
    call.answer = answer;
    const date = Date.now();
    call.startedAt = date;
    call.updatedAt = date;
    call.save();
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const rejectCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id);
    if (!call) return res.status(404).send("No call found");
    call.state = "rejected";
    call.save();
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const endCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id);
    if (!call) return res.status(404).send("No call found");
    call.state = "ended";
    const date = Date.now();
    call.endedAt = date;
    call.save();
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const missCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id);
    if (!call) return res.status(404).send("No call found");
    call.state = "missed";
    const date = Date.now();
    call.endedAt = date;
    call.save();
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTime = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id);
    if (!call) return res.status(404).send("No call found");
    call.updatedAt = Date.now();
    call.save();
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { offer, answer } = req.body;
    const call = await Call.findById(id);
    if (!call) return res.status(404).send("No call found");
    if (offer) call.offer = offer;
    if (answer) call.answer = answer;
    call.updatedAt = Date.now();
    call.save();
    res.status(200).send(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCallsByChatroomId = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.deleteMany({
      chatroomId: id,
    });
    res.status(200).send("Deleted chatroom calls");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCallsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const calls = await Call.deleteMany().or([
      {
        callerId: id,
      },
      {
        receiverId: id,
      },
    ]);
    res.status(200).send("Deleted user calls");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findByIdAndDelete(id);
    if (!call) return res.status(404).send("No call found");
    res.status(200).send("Deleted call");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCalls = async (req, res) => {
  try {
    const call = await Call.deleteMany();
    res.status(200).send("Deleted all calls");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCalls,
  getCall,
  getCallsByChatroomId,
  getCallsByUserId,
  createCall,
  acceptCall,
  rejectCall,
  endCall,
  missCall,
  updateTime,
  updateCall,
  deleteCallsByChatroomId,
  deleteCallsByUserId,
  deleteCall,
  deleteCalls,
};
