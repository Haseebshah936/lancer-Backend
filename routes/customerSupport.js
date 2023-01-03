const {
  createDispute,
  getCustomerSupportIssues,
  getDisputes,
  getPendingDisputes,
  getActiveDisputes,
  getResolvedDisputes,
  updateDispute,
  becomeResolver,
  deleteIssue,
  getDispute,
  createProjectDispute,
  createAptitudeTestDispute,
  createOtherDispute,
  activateDispute,
  resolveDispute,
  getProjectDisputes,
  getAptitudeTestDisputes,
  getOtherDisputes,
  getDisputesByCreatorId,
  getAptitudeTestDisputeByCreatorId,
  deleteAllDisputes,
} = require("../controllers/customerSupport");

const router = require("express").Router();

router.get("/", getCustomerSupportIssues);
router.get("/:id", getDispute);
router.get("/disputes/creatorId", getDisputesByCreatorId);
router.get("/aptitudeTestDispute/creatorId", getAptitudeTestDisputeByCreatorId);
router.get("/disputes/", getDisputes);
router.get("/projectDisputes/", getProjectDisputes);
router.get("/aptitudeTestDisputes/", getAptitudeTestDisputes);
router.get("/otherDisputes/", getOtherDisputes);
router.get("/dispute/pending", getPendingDisputes);
router.get("/dispute/active", getActiveDisputes);
router.get("/dispute/resolved", getResolvedDisputes);
router.post("/projectDispute", createProjectDispute);
router.post("/aptitudeTest", createAptitudeTestDispute);
router.post("/other", createOtherDispute);
router.put("/:id", updateDispute);
router.put("/active/:id", activateDispute);
router.put("/resolve/:id", resolveDispute);
router.put("/asignHandler/:id", becomeResolver);
router.delete("/:id", deleteIssue);
router.delete("/", deleteAllDisputes);

module.exports = router;
