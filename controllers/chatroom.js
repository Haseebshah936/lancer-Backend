const { Chatroom, Participant } = require("../models/chatroom");

const createChatroom = async (req, res) => {
  try {
    const { creatorId, participantId } = req.body;
    const possibilty = await Chatroom.findOne().or([
      {
        creatorId: creatorId,
        participants: {
          $elemMatch: {
            userId: participantId,
          },
        },
        isGroup: false,
      },
      {
        creatorId: participantId,
        participants: {
          $elemMatch: {
            userId: creatorId,
          },
        },
        isGroup: false,
      },
    ]);
    if (possibilty) {
      console.log("Chatroom already exists");
      return res.status(200).send(possibilty);
    }
    const newChatroom = new Chatroom({
      creatorId,
      participants: [
        new Participant({
          userId: participantId,
        }),
        new Participant({
          userId: creatorId,
        }),
      ],
      visited: [{}],
    });
    const response = await newChatroom.save();
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
const createChatroomWithId = async (req, res) => {
  try {
    const { creatorId, participantId, id } = req.body;
    const possibilty = await Chatroom.findOne().or([
      {
        creatorId: creatorId,
        participants: {
          $elemMatch: {
            userId: participantId,
          },
        },
        isGroup: false,
      },
      {
        creatorId: participantId,
        participants: {
          $elemMatch: {
            userId: creatorId,
          },
        },
        isGroup: false,
      },
    ]);
    if (possibilty) {
      console.log("Chatroom already exists");
      return res.status(200).send(possibilty);
    }
    const newChatroom = new Chatroom({
      creatorId,
      _id: id,
      participants: [
        new Participant({
          userId: participantId,
        }),
        new Participant({
          userId: creatorId,
        }),
      ],
      visited: [{}],
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
    const participantsArray = [];
    participants.forEach((participant) => {
      participantsArray.push(new Participant({ userId: participant }));
    });
    participantsArray.push(
      new Participant({ userId: creatorId, isAdmin: true })
    );
    const newChatroom = new Chatroom({
      creatorId,
      participants: participantsArray,
      image,
      description,
      groupName,
      isGroup: true,
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
    const { id, userId } = req.params;
    const chatroom = await Chatroom.findById(id)
      .populate(
        "participants.userId latestMessage",
        "profilePic name isOnline text type createdAt"
      )
      .sort({ "latestMessage.createdAt": -1 });
    if (!chatroom) return res.status(404).send("Chatroom not found");
    let formattedChatroom;
    let subtitle = "";
    let date = null;
    let unread = false;
    const user = chatroom.participants.filter(
      (e) => e.userId?._id?.toString() === userId
    )[0];
    // console.log(chatroom.latestMessage);
    if (chatroom?.latestMessage) {
      subtitle =
        chatroom.latestMessage?.type === "text"
          ? chatroom.latestMessage?.text
          : "key##->doc";
      date = new Date(chatroom.latestMessage?.createdAt);
      unread = date.getTime() > new Date(user.lastVisited).getTime();
    } else {
      date = new Date(chatroom.createdAt);
    }

    if (chatroom?.isGroup) {
      // console.log("Chatrooms ", chatroom?._id, chatroom?.isGroup);
      formattedChatroom = {
        avatar: chatroom.image,
        alt: chatroom.groupName + " image",
        title: chatroom.groupName,
        description: chatroom.description,
        subtitle,
        date,
        unread,
        muted: user.muted,
        userParticipantId: user._id,
        id: chatroom._id,
        isGroup: chatroom.isGroup,
      };
    } else {
      const participant = chatroom.participants.filter(
        (e) => e.userId?._id?.toString() !== userId
      )[0];
      formattedChatroom = {
        avatar: participant.userId.profilePic,
        alt: participant.userId.name + " image",
        title: participant.userId.name,
        description: chatroom.description,
        subtitle,
        date,
        unread,
        muted: user.muted,
        id: chatroom._id,
        userParticipantId: user._id,
        participantId: participant.userId._id,
        isGroup: chatroom.isGroup,
        isOnline: participant.userId.isOnline,
      };
    }
    res.status(201).json(formattedChatroom);
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
    // console.log(id);
    const chatrooms = await Chatroom.find({
      participants: {
        $elemMatch: {
          userId: id,
        },
      },
    })
      .populate(
        "participants.userId latestMessage",
        "profilePic name isOnline text type createdAt"
      )
      .sort({ updatedAt: -1 });
    let formattedChatrooms = [];
    // console.log("Chatrooms ", chatrooms);
    chatrooms.forEach((chatroom, i) => {
      let subtitle = "";
      let date = null;
      let unread = false;
      // console.log("Chatroom", chatroom);
      const user = chatroom?.participants.filter((e) => {
        // console.log(e.toString());
        return e.userId?._id?.toString() === id;
      })[0];
      // console.log(chatroom.latestMessage);
      if (chatroom?.latestMessage) {
        subtitle =
          chatroom.latestMessage?.type === "text"
            ? chatroom.latestMessage?.text
            : "key##->doc";
        date = new Date(chatroom.latestMessage?.createdAt);
        unread = date.getTime() > new Date(user.lastVisited).getTime();
      }

      if (chatroom?.isGroup) {
        // console.log("Chatrooms ", chatroom?._id, chatroom?.isGroup);
        formattedChatrooms.push({
          avatar: chatroom.image,
          alt: chatroom.groupName + " image",
          title: chatroom.groupName,
          description: chatroom.description,
          subtitle,
          date,
          unread,
          muted: user.muted,
          userParticipantId: user._id,
          id: chatroom._id,
          isGroup: chatroom.isGroup,
        });
      } else {
        const participant = chatroom.participants.filter(
          (e) => e.userId?._id?.toString() !== id
        )[0];
        formattedChatrooms.push({
          avatar: participant.userId.profilePic,
          alt: participant.userId.name + " image",
          title: participant.userId.name,
          description: chatroom.description,
          subtitle,
          date,
          unread,
          muted: user.muted,
          id: chatroom._id,
          userParticipantId: user._id,
          participantId: participant.userId._id,
          isGroup: chatroom.isGroup,
          isOnline: participant.userId.isOnline,
        });
      }
    });
    res.status(200).json(formattedChatrooms);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getChatroomsByUserIdWithCreatorAcess = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const chatrooms = await Chatroom.find({
      participants: {
        $elemMatch: {
          userId: id,
          isAdmin: true,
        },
      },
      isGroup: true,
    })
      .populate(
        "participants.userId latestMessage",
        "profilePic name isOnline text type createdAt"
      )
      .sort({ updatedAt: -1 });
    let formattedChatrooms = [];
    // console.log("Chatrooms ", chatrooms);
    chatrooms.forEach((chatroom, i) => {
      let subtitle = "";
      let date = null;
      let unread = false;
      // console.log("Chatroom", chatroom);
      const user = chatroom?.participants.filter((e) => {
        // console.log(e.toString());
        return e.userId?._id?.toString() === id;
      })[0];
      // console.log(chatroom.latestMessage);
      if (chatroom?.latestMessage) {
        subtitle =
          chatroom.latestMessage?.type === "text"
            ? chatroom.latestMessage?.text
            : "key##->doc";
        date = new Date(chatroom.latestMessage?.createdAt);
        unread = date.getTime() > new Date(user.lastVisited).getTime();
      }

      if (chatroom?.isGroup) {
        // console.log("Chatrooms ", chatroom?._id, chatroom?.isGroup);
        formattedChatrooms.push({
          avatar: chatroom.image,
          alt: chatroom.groupName + " image",
          title: chatroom.groupName,
          description: chatroom.description,
          subtitle,
          date,
          unread,
          muted: user.muted,
          userParticipantId: user._id,
          id: chatroom._id,
          isGroup: chatroom.isGroup,
        });
      }
    });
    res.status(200).json(formattedChatrooms);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { participantId } = req.body;
    const { id } = req.params;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    const participant = chatroom.participants.id(participantId);
    console.log(participant);
    participant.isAdmin = true;
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
      (admin) => admin?.toString() !== userId
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
    chatroom.participants.push(new Participant({ userId }));
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

const blockRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    let user = chatroom.participants.id(participantId);
    user.blocked = true;
    chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const unBlockRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.participants.id(participantId).blocked = false;
    chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const muteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.participants.id(participantId).muted = true;
    chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const unMuteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.participants.id(participantId).muted = false;
    chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const lastVisitedRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId, date } = req.body;
    const chatroom = await Chatroom.findById(id);
    if (!chatroom) return res.status(404).send("Chatroom not found");
    chatroom.participants.id(participantId).lastVisited = new Date(date);
    chatroom.save();
    res.status(200).send(chatroom);
  } catch (error) {
    res.status(500).send(error.message);
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
  createChatroomWithId,
  createGroupChatroom,
  getChatroom,
  getChatrooms,
  getChatroomsByUserId,
  getChatroomsByUserIdWithCreatorAcess,
  makeAdmin,
  removeAdmin,
  blockRoom,
  unBlockRoom,
  muteRoom,
  unMuteRoom,
  lastVisitedRoom,
  addParticipant,
  removeParticipant,
  updateImage,
  updateDescription,
  updateGroupName,
};
