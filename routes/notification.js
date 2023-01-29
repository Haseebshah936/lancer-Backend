const {
  getNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  deleteNotifications,
  getMessageNotificationsByUserId,
  getNotificationsByUserId,
  readNotitication,
  getAllNotificationsByUserId,
} = require("../controllers/notification");

const router = require("express").Router();

router.get("/", getNotifications);
router.get("/:id", getNotification);
router.get("/user/:id", getNotificationsByUserId);
router.get("/all/user/:id", getAllNotificationsByUserId);
router.get("/messages/user/:id", getMessageNotificationsByUserId);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.put("/read/:id", readNotitication);
router.delete("/:id", deleteNotification);
router.delete("/", deleteNotifications);

module.exports = router;
