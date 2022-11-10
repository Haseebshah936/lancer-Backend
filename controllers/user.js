const User = require("../models/user");

const getUser = async (req, res) => {
  const { email } = req.params;
  console.log("email", email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUser,
};
