const {
  getViewsByUserIdForYear,
  getViews,
  getView,
  getViewsByProductId,
  createView,
  deleteView,
  deleteAllViews,
} = require("../controllers/view");

const router = require("express").Router();

router.get("/", getViews);
router.get("/:id", getView);
router.get("/user/:id", getViewsByUserIdForYear);
router.get("/product/:id", getViewsByProductId);
router.post("/", createView);
router.delete("/:id", deleteView);
router.delete("/", deleteAllViews);

module.exports = router;
