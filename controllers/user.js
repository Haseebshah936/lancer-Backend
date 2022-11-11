const c = require("config");
const { User, Seller } = require("../models/user");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("seller").select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email })
      .populate("seller")
      .select("-password");
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
    const user = await User.findById(id)
      .populate("seller")
      .select(
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
    );
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
    );
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
    );
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
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const makeSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { skills, about, experience, education, achivements } = req.body;
    const seller = new Seller({
      skills,
      about,
      experience,
      education,
      achivements,
    });
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: { seller },
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const completeProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, profilePic, country, currency } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          profilePic,
          country,
          currency,
        },
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
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
    );
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
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateOnlineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOnline } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          isOnline,
        },
      },
      {
        new: true,
      }
    );
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
    );
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
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
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
    );
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
    );
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
    );
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getUsers,
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
  updateActiveOrders,
  updateCancelledOrders,
  updateCompletedOrders,
};
