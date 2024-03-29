const c = require("config");
const { User, Seller, Subscription } = require("../models/user");
const product = require("../models/product");
const webPush = require("web-push");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRankedUsers = async (req, res) => {
  try {
    const { limit } = req.query;
    const users = await User.find({
      seller: { $ne: null },
      "seller.reviews": { $ne: null },
      "seller.rating": { $ne: 0 },
    })
      .select(
        "profilePic name country badge seller.reviews seller.completedOrders seller.score seller.rating"
      )
      .sort({ "seller.score": -1 })
      .limit(parseInt(limit));
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getActiveUsers = async (req, res) => {
  try {
    const users = await User.find({
      state: {
        $ne: "banned",
      },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getBannedUsers = async (req, res) => {
  try {
    const users = await User.find({
      state: "banned",
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getSellers = async (req, res) => {
  try {
    console.log("get sellers");
    const users = await User.find()
      .and([
        {
          seller: { $ne: null },
        },
        {
          seller: { $exists: true },
        },
      ])
      .select("-password");
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
const getUserById = async (req, res) => {
  console.log("get user by id");
  try {
    const { id } = req.params;
    const user = await User.findById(id).select(
      "seller responseTime stars name profilePic country badge reviews"
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const changeFollowersCount = async (req, res) => {
  try {
    const { count } = req.body;
    const { id } = req.params;

    console.log(count, id);

    const user = await User.findByIdAndUpdate(
      id,
      {
        $inc: { followers: count },
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const changeFollowingCount = async (req, res) => {
  try {
    const { count } = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $inc: { following: count },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
const increaseReviewCount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      {
        $inc: { reviews: 1 },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeStars = async (req, res) => {
  try {
    const { stars } = req.body;
    const { id } = req.params;
    console.log(stars, id);
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: { stars },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeResponseTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { responseTime } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: { responseTime },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const makeSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      skills,
      about,
      experience,
      education,
      achivements,
      languages,
      englishLevel,
    } = req.body;
    const seller = new Seller({
      skills,
      about,
      experience,
      education,
      achivements,
      languages,
      englishLevel,
    });

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: { seller },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const removeSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: { seller: null },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const completeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profilePic, country, currency, DOB, gender } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          profilePic,
          country,
          currency,
          DOB,
          gender,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    const products = await product.Product.updateMany(
      { "owner._id": id },
      {
        $set: {
          "owner.name": name,
          "owner.profilePic": profilePic,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updateSearchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { recentSearches } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          recentSearches,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { badge } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          badge,
        },
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(404).send("User not found");
    const products = await product.Product.updateMany(
      { "owner._id": id },
      {
        $set: {
          "owner.badge": badge,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const updateOnlineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isOnline: Date.now(),
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateCurrentBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentBalance } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          currentBalance,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateEarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { earnings } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          earnings,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateRecentSearches = async (req, res) => {
  try {
    const { id } = req.params;
    const { recentSearch } = req.body;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).send("User not found");
    if (user.recentSearches.includes(recentSearch))
      user.recentSearches.splice(user.recentSearches.indexOf(recentSearch), 1);
    else if (user.recentSearches.length === 5) user.recentSearches.shift();
    user.recentSearches.push(recentSearch);
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateActiveOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { activeOrders } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "seller.activeOrders": activeOrders,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateCancelledOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelledOrders } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "seller.cancelledOrders": cancelledOrders,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCompletedOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const { completedOrders } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "seller.completedOrders": completedOrders,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          "seller.score": score,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(id, {
      state: "banned",
      bannedReason: reason,
    });
    if (!user) res.status(404).send("User not found");
    res.status(200).send("User banned successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const unBanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {
      state: "active",
    });
    if (!user) res.status(404).send("User not found");
    res.status(200).send("User unbanned successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

const subscribe = async (req, res) => {
  try {
    // console.log("subscription request received", req.body);
    const { id } = req.params;
    const { endpoint, expirationTime, keys } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");
    const newSubscription = new Subscription({
      endpoint,
      expirationTime,
      keys,
    });
    user.subscription = newSubscription;
    await user.save();
    // console.log("new subscription saved", newSubscription);
    // return res.send ('hallo');
    // const options = {
    //   vapidDetails: {
    //     subject: "mailto:haseebshah936@gmail.com",
    //     publicKey:
    //       "BFpFtQOG8CLr_-AWQfz5JUrLE8FJ7vZEJMAokteah55WbdrW4Rs0BigiS1j0wQZAUO4rkg_EviJc81cDTOXtRNM",
    //     privateKey: "rXWNPqO5L4SAviXKVAxm4l6R9D5XHXi12iQxUst5Wd8",
    //   },
    // };
    // const res2 = await webPush.sendNotification(
    //   newSubscription,
    //   JSON.stringify({
    //     title: "Hello from server",
    //     description: "this message is coming from the server",
    //     image:
    //       "https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg",
    //   }),
    //   options
    // );
    // console.log("notification sent", res2);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getUsers,
  getRankedUsers,
  getActiveUsers,
  getBannedUsers,
  getSellers,
  getUser,
  getUserById,
  changeFollowersCount,
  changeFollowingCount,
  changeStars,
  changeResponseTime,
  makeSeller,
  completeProfile,
  updateSearchHistory,
  increaseReviewCount,
  updateBadge,
  updateOnlineStatus,
  updateCurrentBalance,
  updateEarning,
  updateRecentSearches,
  updateActiveOrders,
  updateCancelledOrders,
  updateCompletedOrders,
  updateScore,
  removeSeller,
  banUser,
  unBanUser,
  subscribe,
};
