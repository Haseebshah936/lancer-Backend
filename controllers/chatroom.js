const Chatroom = require("../models/chatroom");

const createGroupChat = async (req, res) => {
  const { participants, creatorId, image, description, groupName } = req.body;
  try {
    const newChatroom = new Chatroom({
      creatorId,
      participants,
      image,
      description,
      groupName,
    });
    newChatroom.save();
    res.status(201).json(newChatroom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getChatroom = async (req, res) => {
  const { participant, creatorId } = req.body;
  try {
    const chatroom = await Chatroom.findOne({
      participant: participant,
      creatorId: creatorId,
    });
    if (chatroom) return res.status(200).json(chatroom);
    const newChatroom = new Chatroom({
      participant,
      creatorId,
    });
    newChatroom.save();
    res.status(201).json(newChatroom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteChatroom = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedChatroom = await Chatroom.findByIdAndDelete(id);
    if (deletedChatroom) {
      return res.status(200).send("Chatroom deleted");
    }
    throw new Error("Chatroom not found");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatroom,
  deleteChatroom,
};
