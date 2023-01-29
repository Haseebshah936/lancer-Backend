const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getNotificationsByUserId = async (req, res) => {
  try {
    let { id, skip } = req.params;
    // skip = parseInt(skip);
    const notification = await Notification.find({
      userId: id,
      isRead: false,
      type: {
        $ne: "chat",
      },
    }).sort({ createdAt: -1 });
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getAllNotificationsByUserId = async (req, res) => {
  try {
    let { id, skip } = req.params;
    // skip = parseInt(skip);
    const notification = await Notification.find({
      userId: id,
      type: {
        $ne: "chat",
      },
    }).sort({ createdAt: -1 });
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const getMessageNotificationsByUserId = async (req, res) => {
  try {
    let { id, skip } = req.params;
    skip = parseInt(skip);
    const notification = await Notification.find({
      userId: id,
      isRead: false,
      type: "chat",
    })
      .populate("senderId", "name profilePic")
      .skip(skip)
      .limit(10)
      .sort({ createdAt: -1 });
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const createNotification = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      userId,
      chatroomId,
      productId,
      senderId,
    } = req.body; // type can be any ["info", "review", "chat","customerSupport"],
    const notification = await new Notification({
      title,
      description,
      type,
      userId,
      chatroomId,
      productId,
      senderId,
    });
    await notification.save();
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      userId,
      chatroomId,
      productId,
      senderId,
    } = req.body;
    const notification = await Notification.findByIdAndUpdate(id);
    if (!notification) return res.status(404).send("Notification not found");
    notification.title = title;
    notification.description = description;
    notification.type = type;
    notification.userId = userId;
    notification.chatroomId = chatroomId;
    notification.productId = productId;
    notification.senderId = senderId;
    await notification.save();
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const readNotitication = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send(notification);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send("Notification deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteNotifications = async (req, res) => {
  try {
    const notifications = await Notification.deleteMany();
    res.status(200).send("Notifications deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getNotifications,
  getNotification,
  getNotificationsByUserId,
  getAllNotificationsByUserId,
  getMessageNotificationsByUserId,
  readNotitication,
  createNotification,
  updateNotification,
  deleteNotification,
  deleteNotifications,
};
