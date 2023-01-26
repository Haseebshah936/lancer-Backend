const {
  getReview,
  getSellerReviews,
  getBuyerReviews,
  createReview,
  createReply,
  updateReview,
  deleteReview,
  getReviews,
  getSellerReviewForProject,
  getBuyerReviewForProject,
  getSellerReviewsCount,
  getBuyerReviewsCount,
  deleteReviews,
  getSellerReviewByProjectId,
  getBuyerReviewByProjectId,
} = require("../controllers/review");
const router = require("express").Router();

router.get("/", getReviews);
router.get("/:id", getReview);
router.get("/sellerReviews/:id", getSellerReviews);
router.get("/sellerReviewsCount/:id", getSellerReviewsCount);
router.get("/buyerReviews/:id", getBuyerReviews);
router.get("/buyerReviewsCount/:id", getBuyerReviewsCount);
router.get("/sellerReview/:userId/:projectId", getSellerReviewForProject);
router.get("/sellerReviewByProjectId/:projectId", getSellerReviewByProjectId);
router.get("/buyerReview/:userId/:projectId", getBuyerReviewForProject);
router.get("/buyerReviewByProjectId/:projectId", getBuyerReviewByProjectId);
router.post("/", createReview);
router.put("/reply/:id", createReply);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
router.delete("/", deleteReviews);

module.exports = router;
