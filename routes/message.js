const {
  createMessage,
  getMessages,
  deleteMessage,
  deleteAllMessages,
  getMessagesCount,
  getMessage,
} = require("../controllers/message");

const router = require("express").Router();

router.get("/:chatroomId/:id/:userId", getMessage);
router.get("/:chatroomId/:userId", getMessages);
router.get("/count/:chatroomId", getMessagesCount);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);
router.delete("/deleteAll/:chatroomId", deleteAllMessages);

module.exports = router;
