const Chatroom = require("../models/chatroom");
const moongose = require("mongoose");

const createChatroom = async (req, res) => {
  try {
    const { creatorId, participantId } = req.body;
    const possibilty = await Chatroom.findOne().or([
      { creatorId: creatorId, participantId: participantId },
      { creatorId: participantId, participantId: creatorId },
    ]);
    if (possibilty) {
      console.log("Chatroom already exists");
      return res.status(200).send(possibilty);
    }
    const newChatroom = new Chatroom({
      creatorId,
      participantId,
    });
    const response = await newChatroom.save();
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const createGroupChatroom = async (req, res) => {
  try {
    const { participants, creatorId, image, description, groupName } = req.body;
    const newChatroom = new Chatroom({
      creatorId,
      participants,
      image,
      description,
      groupName,
      isGroup: true,
      admin: [creatorId],
    });
    newChatroom.save();
    res.status(201).json(newChatroom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getChatroom = async (req, res) => {
  try {
    const { id } = req.params;
    const chatroom = await Chatroom.findById(id);
    if (chatroom) return res.status(200).json(chatroom);
    res.status(201).json(chatroom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find();
    res.status(200).json(chatrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatroomsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const chatrooms = await Chatroom.find().or([
      { creatorId: id },
      { participantId: id },
      {
        participants: {
          $in: [id],
        },
      },
    ]);
    res.status(200).json(chatrooms);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addAdmin = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.admin.push(userId);
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    console.log(userId);
    let chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.admin = chatroom.admin.filter(
      (admin) => admin.toString() !== userId
    );
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.participants.push(userId);
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const removeParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.participants = chatroom.participants.filter(
      (e) => e.toString() !== userId
    );
    chatroom.admin = chatroom.admin.filter((e) => e.toString() !== userId);
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    req.status(500).send(error.message);
  }
};

const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.image = image;
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.description = description;
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateGroupName = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.groupName = groupName;
    await chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteChatroom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChatroom = await Chatroom.findByIdAndDelete(id);
    if (!deletedChatroom) {
      return res.status(200).send("Chatroom not found");
    }
    res.status(200).send("Deleted chatroom");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createChatroom,
  deleteChatroom,
  createGroupChatroom,
  getChatroom,
  getChatrooms,
  getChatroomsByUserId,
  addAdmin,
  removeAdmin,
  addParticipant,
  removeParticipant,
  updateImage,
  updateDescription,
  updateGroupName,
};
