const {
  createDispute,
  getCustomerSupportIssues,
  getDisputes,
  getIssueById,
  getPendingDisputes,
  getActiveDisputes,
  getResolvedDisputes,
  updateDispute,
  activateIssue,
  resolveIssue,
  becomeResolver,
  deleteIssue,
} = require("../controllers/customerSupport");

const router = require("express").Router();

router.get("/", getCustomerSupportIssues);
router.get("/:id", getIssueById);
router.get("/dispute/", getDisputes);
router.get("/dispute/pending", getPendingDisputes);
router.get("/dispute/active", getActiveDisputes);
router.get("/dispute/resolved", getResolvedDisputes);
router.post("/", createDispute);
router.put("/:id", updateDispute);
router.put("/active/:id", activateIssue);
router.put("/resolve/:id", resolveIssue);
router.put("/asignHandler/:id", becomeResolver);
router.delete("/:id", deleteIssue);

module.exports = router;
