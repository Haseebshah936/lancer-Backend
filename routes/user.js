const user = require("../controllers/user");
const router = require("express").Router();

router.get("/:email", user.getUser);
router.get("/getUser/:id", user.getUserById);
router.put("/updateFollowers/:id", user.changeFollowersCount);
router.put("/updateFollowing/:id", user.changeFollowingCount);
router.put("/updateReviews/:id", user.increaseReviewCount);
router.put("/updateResponseTime/:id", user.changeResponseTime);
router.put("/updateRating/:id", user.changeStars);
router.put("/updateSearchHistory/:id", user.updateSearchHistory);
router.put("/makeSeller/:id", user.makeSeller);
router.put("/updateProfile/:id", user.completeProfile);
router.put("/updateBadge/:id", user.updateBadge);
router.put("/updateOnlineStatus/:id", user.updateOnlineStatus);
router.put("/updateCurrentBalance/:id", user.updateCurrentBalance);
router.put("/updateEarnings/:id", user.updateEarning);
router.put("/updateActiveOrders/:id", user.updateActiveOrders);
router.put("/updateCancelledOrders/:id", user.updateCancelledOrders);
router.put("/updateCompletedOrders/:id", user.updateCompletedOrders);

module.exports = router;
