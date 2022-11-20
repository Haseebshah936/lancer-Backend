const router = require("express").Router();
const {
  createChatroom,
  deleteChatroom,
  createGroupChatroom,
  getChatroom,
  getChatrooms,
  getChatroomsByUserId,
} = require("../controllers/chatroom");

router.get("/", getChatrooms);
router.get("/:id", getChatroom);
router.get("/getChatroomsById/:id", getChatroomsByUserId);
router.post("/createMessage", createChatroom);
router.post("/groupChatroom", createGroupChatroom);
router.delete("/:id", deleteChatroom);

module.exports = router;
