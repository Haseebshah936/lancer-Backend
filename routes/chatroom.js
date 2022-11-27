const router = require("express").Router();
const {
  createChatroom,
  deleteChatroom,
  createGroupChatroom,
  getChatroom,
  getChatrooms,
  getChatroomsByUserId,
  makeAdmin,
  removeAdmin,
  addParticipant,
  removeParticipant,
  updateImage,
  updateDescription,
  updateGroupName,
  blockRoom,
  unBlockRoom,
  muteRoom,
  unMuteRoom,
  lastVisitedRoom,
} = require("../controllers/chatroom");

router.get("/", getChatrooms);
router.get("/:id/:userId", getChatroom);
router.get("/getChatroomsById/:id", getChatroomsByUserId);
router.post("/createChatroom", createChatroom);
router.post("/createGroupChatroom", createGroupChatroom);
router.put("/makeAdmin/:id", makeAdmin);
router.put("/removeAdmin/:id", removeAdmin);
router.put("/addParticipant/:id", addParticipant);
router.put("/removeParticipant/:id", removeParticipant);
router.put("/blockChatroom/:id", blockRoom);
router.put("/unBlockChatroom/:id", unBlockRoom);
router.put("/muteChatroom/:id", muteRoom);
router.put("/unMuteChatroom/:id", unMuteRoom);
router.put("/lastVisitedChatroom/:id", lastVisitedRoom);
router.put("/updateImage/:id", updateImage);
router.put("/updateDescription/:id", updateDescription);
router.put("/updateGroupName/:id", updateGroupName);
router.delete("/:id", deleteChatroom);

module.exports = router;
