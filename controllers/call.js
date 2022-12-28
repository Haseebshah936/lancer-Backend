const Call = require("../models/call");

const getCalls = async (req, res) => {
  try {
    const calls = await Call.find().sort({
      createdAt: -1,
    });
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findById(id)
      .populate("callerId receiverId", "name profilePic")
      .populate("chatroomId", "participants");
    if (!call) return res.status(404).send("No call found");
    res.status(200).send(call);
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    res.status(500).send(error);
  }
};

const createCall = async (req, res) => {
  try {
    const { chatroomId, callerId, receiverId, offer } = req.body;
    const call = new Call({
      chatroomId,
      callerId,
      receiverId,
      offer,
    });
    call.save();
    res.status(201).send(call);
  } catch (error) {
    res.status(500).send(error);
  }
};

const acceptCall = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
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
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    res.status(500).send(error);
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
    res.status(500).send(error);
  }
};

const deleteCall = async (req, res) => {
  try {
    const { id } = req.params;
    const call = await Call.findByIdAndDelete(id);
    if (!call) return res.status(404).send("No call found");
    res.status(200).send("Deleted call");
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCalls = async (req, res) => {
  try {
    const call = await Call.deleteMany();
    res.status(200).send("Deleted all calls");
  } catch (error) {
    res.status(500).send(error);
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
  updateTime,
  updateCall,
  deleteCallsByChatroomId,
  deleteCall,
  deleteCalls,
};
