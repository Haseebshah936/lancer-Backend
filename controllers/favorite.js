const Favorite = require("../models/favorite");

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.findById(id).populate(
      "productId favoriteUserId",
      "title images rating reviews ranking cost  name profilePic badge seller.rating seller.reviews"
    );

    res.json(favorite);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getFavoritesByUserId = async (req, res) => {
  try {
    let { id, skip } = req.params;
    if (skip === undefined) skip = 0;
    const favorites = await Favorite.find({ userId: id })
      .populate(
        "productId favoriteUserId",
        "title images rating reviews ranking cost  name profilePic badge seller.rating seller.reviews"
      )
      .skip(skip)
      .limit(10);
    res.json(favorites);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const createFavorite = async (req, res) => {
  try {
    const { userId, productId, favoriteUserId } = req.body;
    const check = await Favorite.findOne({
      userId,
      productId,
      favoriteUserId,
    });
    if (check) return res.status(400).json("Already in favorites");
    const favorite = new Favorite({
      userId,
      productId,
      favoriteUserId,
    });
    const savedFavorite = await favorite.save();
    res.json(savedFavorite);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, productId, favoriteUserId } = req.body;
    const favorite = await Favorite.findByIdAndUpdate(
      id,
      {
        userId,
        productId,
        favoriteUserId,
      },
      {
        new: true,
      }
    );
    res.json(favorite);
  } catch (error) {
    res.status(500).json(err);
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    await Favorite.findByIdAndDelete(id);
    res.json("Favorite has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteFavorites = async (req, res) => {
  try {
    await Favorite.deleteMany();
    res.json("All favorites have been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getFavorites,
  getFavorite,
  getFavoritesByUserId,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavorites,
};
