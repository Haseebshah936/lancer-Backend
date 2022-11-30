const Message = require("../models/message");
const { Chatroom } = require("../models/chatroom");

const getMessage = async (req, res) => {
  try {
    const { chatroomId, id, userId } = req.params;
    console.log(id, userId);
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    const participantId = chatroom.participants.filter(
      (participant) => participant.userId.toString() === userId
    )[0]._id;
    chatroom.participants.id(participantId).lastVisited = new Date();
    chatroom.save();
    const message = await Message.findById(id).populate(
      "userId",
      "name profilePic"
    );
    if (!message) return res.status(404).send("Message not found");
    res.status(200).json(message);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatroomId, userId } = req.params;
    let { skip } = req.query;
    // console.log(chatroomId, userId);
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    const participantId = chatroom.participants.filter(
      (participant) => participant.userId.toString() === userId
    )[0]._id;
    chatroom.participants.id(participantId).lastVisited = new Date();
    chatroom.save();
    if (skip === undefined) skip = 0;
    // console.log(chatroomId);
    const messages = await Message.find({
      chatroomId,
    })
      .populate("userId", "name profilePic")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(10);
    res.status(200).send(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getMessagesCount = async (req, res) => {
  try {
    const { chatroomId } = req.params;
    console.log(chatroomId);
    const messages = await Message.find({
      chatroomId,
    }).estimatedDocumentCount();
    res.status(200).send({ count: messages });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createMessage = async (req, res) => {
  try {
    const { chatroomId, userId, type, text, uri } = req.body;
    console.log(req.body);
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    const newMessage = new Message({
      chatroomId,
      userId,
      type,
      text,
      uri,
    });
    console.log(chatroom.participants);
    chatroom.latestMessage = newMessage._id;
    const participantId = chatroom.participants.filter(
      (participant) => participant.userId.toString() === userId._id
    )[0]._id;
    chatroom.participants.id(participantId).lastVisited = new Date();
    chatroom.updatedAt = new Date();
    const response = await newMessage.save();
    await chatroom.save();
    res.status(201).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndRemove(id);
    if (!message) return res.status(404).send("Message not found");
    res.status(200).send("Message deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteAllMessages = async (req, res) => {
  try {
    const { chatroomId } = req.params;
    console.log("DeleteAll", chatroomId);
    const messages = await Message.deleteMany({ chatroomId });
    if (!messages) return res.status(404).send("Messages not found");
    res.status(200).send("Messages deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getMessage,
  getMessages,
  getMessagesCount,
  createMessage,
  deleteMessage,
  deleteAllMessages,
};
