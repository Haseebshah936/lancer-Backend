const {
  getCalls,
  getCall,
  getCallsByChatroomId,
  getCallsByUserId,
  createCall,
  acceptCall,
  rejectCall,
  endCall,
  updateCall,
  updateTime,
  deleteCallsByChatroomId,
  deleteCall,
  deleteCalls,
  deleteCallsByUserId,
  missCall,
} = require("../controllers/call");

const router = require("express").Router();

router.get("/", getCalls);
router.get("/:id", getCall);
router.get("/chatroom/:id", getCallsByChatroomId);
router.get("/user/:id", getCallsByUserId);
router.post("/", createCall);
router.put("/acceptCall/:id", acceptCall);
router.put("/rejectCall/:id", rejectCall);
router.put("/endCall/:id", endCall);
router.put("/missCall/:id", missCall);
router.put("/updateTime/:id", updateTime);
router.put("/:id", updateCall);
router.delete("/chatroom/:id", deleteCallsByChatroomId);
router.delete("/user/:id", deleteCallsByUserId);
router.delete("/:id", deleteCall);
router.delete("/", deleteCalls);

module.exports = router;
