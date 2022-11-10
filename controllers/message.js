const message = require("../models/message");

const createMessage = async (req, res) => {
  const { senderId, chatroomId, text, messageType, uri } = req.body;
  try {
    const newMessage = new message({
      senderId,
      chatroomId,
      text,
      messageType,
      uri,
    });
    newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
};
