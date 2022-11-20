const { find } = require("../models/message");
const Message = require("../models/message");

const getMessages = async (req, res) => {
  try {
    const { chatroomId } = req.params;
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    console.log(chatroomId);
    const messages = await Message.find({
      chatroomId,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(10);
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).json({ message: err.message });
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
    const newMessage = new Message({
      chatroomId,
      userId,
      type,
      text,
      uri,
    });
    const response = await newMessage.save();
    res.status(201).send(response);
  } catch (err) {
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
  getMessages,
  getMessagesCount,
  createMessage,
  deleteMessage,
  deleteAllMessages,
};
