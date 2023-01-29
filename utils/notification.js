const webPush = require("web-push");
const Notification = require("../models/notification");

const sendSoftNotification = async (subscription, title, message, image) => {
  const options = {
    vapidDetails: {
      subject: "mailto:haseebshah936@gmail.com",
      publicKey:
        "BFpFtQOG8CLr_-AWQfz5JUrLE8FJ7vZEJMAokteah55WbdrW4Rs0BigiS1j0wQZAUO4rkg_EviJc81cDTOXtRNM",
      privateKey: "rXWNPqO5L4SAviXKVAxm4l6R9D5XHXi12iQxUst5Wd8",
    },
  };
  const res2 = await webPush.sendNotification(
    subscription,
    JSON.stringify({
      title,
      description: message,
      image,
    }),
    options
  );
  return res2;
};

const sendHardNotification = async (
  title,
  description,
  type,
  userId,
  chatroomId,
  participantId,
  senderId
) => {
  try {
    // type can be any ["info", "review", "chat","customerSupport"],
    const notification = await new Notification({
      title,
      description,
      type,
      userId,
      chatroomId,
      participantId,
      senderId,
    });
    console.log("Sending Notification", notification);
    await notification.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendSoftNotification,
  sendHardNotification,
};

// "https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg",
