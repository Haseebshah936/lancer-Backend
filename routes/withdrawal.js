const {
  getPendingWithdrawls,
  getWithdrawls,
  getWithdrawl,
  getApprovedWithdrawls,
  getRejectedWithdrawls,
  getWithdrawlsByUserId,
  getPendingWithdrawlsByUserId,
  getApprovedWithdrawlsByUserId,
  getRejectedWithdrawlsByUserId,
  createWithdrawl,
  updateWithdrawal,
  approveWithdrawal,
  rejectWithdrawal,
  deleteWithdrawl,
  deleteAllWithdrawls,
} = require("../controllers/withdrawal");

const router = require("express").Router();

router.get("/", getWithdrawls);
router.get("/:id", getWithdrawl);
router.get("/pending", getPendingWithdrawls);
router.get("/approved", getApprovedWithdrawls);
router.get("/rejected", getRejectedWithdrawls);
router.get("/user/:id", getWithdrawlsByUserId);
router.get("/user/pending/:id", getPendingWithdrawlsByUserId);
router.get("/user/approved/:id", getApprovedWithdrawlsByUserId);
router.get("/user/rejected/:id", getRejectedWithdrawlsByUserId);
router.post("/", createWithdrawl);
router.put("/:id", updateWithdrawal);
router.put("/approve/:id", approveWithdrawal);
router.put("/reject/:id", rejectWithdrawal);
router.delete("/:id", deleteWithdrawl);
router.delete("/", deleteAllWithdrawls);

module.exports = router;
