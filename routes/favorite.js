const router = require("express").Router();
const {
  getFavorite,
  getFavorites,
  getFavoritesByUserId,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavorites,
  getFavoriteByUserId,
} = require("../controllers/favorite");

router.get("/", getFavorites);
router.get("/:id", getFavorite);
router.get("/user/:id", getFavoritesByUserId);
router.get("/user/:id/:productId/:favoriteUserId", getFavoriteByUserId);
router.post("/", createFavorite);
router.put("/:id", updateFavorite);
router.delete("/:id", deleteFavorite);
router.delete("/", deleteFavorites);

module.exports = router;
