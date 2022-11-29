const {
  getReview,
  getSellerReviews,
  getBuyerReviews,
  createReview,
  createReply,
  updateReview,
  deleteReview,
  getReviews,
} = require("../controllers/review");
const router = require("express").Router();

router.get("/", getReviews);
router.get("/:id", getReview);
router.get("/sellerReviews/:id", getSellerReviews);
router.get("/buyerReviews/:id", getBuyerReviews);
router.post("/", createReview);
router.put("/reply/:id", createReply);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
