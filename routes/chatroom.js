const router = require("express").Router();
const {
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
} = require("../controllers/chatroom");

router.get("/", getChatrooms);
router.get("/:id", getChatroom);
router.get("/getChatroomsById/:id", getChatroomsByUserId);
router.post("/createMessage", createChatroom);
router.put("/addAdmin/:id", addAdmin);
router.put("/removeAdmin/:id", removeAdmin);
router.put("/addParticipant/:id", addParticipant);
router.put("/removeParticipant/:id", removeParticipant);
router.put("/updateImage/:id", updateImage);
router.put("/updateDescription/:id", updateDescription);
router.put("/updateGroupName/:id", updateGroupName);
router.delete("/:id", deleteChatroom);

module.exports = router;
