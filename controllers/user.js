const c = require("config");
const { User, Seller } = require("../models/user");
const product = require("../models/product");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getActiveUsers = async (req, res) => {
  try {
    const users = await User.find({
      state: "active",
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
    if (user.recentSearches.length === 5) user.recentSearches.shift();
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

module.exports = {
  getUsers,
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
};
