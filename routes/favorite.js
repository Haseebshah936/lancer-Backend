const router = require("express").Router();
const {
  getFavorite,
  getFavorites,
  getFavoritesByUserId,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  deleteFavorites,
} = require("../controllers/favorite");

router.get("/", getFavorites);
router.get("/:id", getFavorite);
router.get("/user/:id", getFavoritesByUserId);
router.post("/", createFavorite);
router.put("/:id", updateFavorite);
router.delete("/:id", deleteFavorite);
router.delete("/", deleteFavorites);

module.exports = router;
