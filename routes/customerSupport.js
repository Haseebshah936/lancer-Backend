const {
  getCustomerSupportIssues,
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
  getActiveDisputesByResolverId,
  getResolvedDisputesByResolverId,
} = require("../controllers/customerSupport");

const router = require("express").Router();

router.get("/", getCustomerSupportIssues);
router.get("/:id", getDispute);
router.get("/disputesByCreatorId/:creatorId", getDisputesByCreatorId);
router.get(
  "/aptitudeTestDispute/:creatorId",
  getAptitudeTestDisputeByCreatorId
);
router.get(
  "/disputes/active/:resolverId/:requestType",
  getActiveDisputesByResolverId
);
router.get(
  "/disputes/resolved/:resolverId/:requestType",
  getResolvedDisputesByResolverId
);
router.get("/disputes/project/", getProjectDisputes);
router.get("/disputes/aptitudeTest/", getAptitudeTestDisputes);
router.get("/disputes/other", getOtherDisputes);
router.get("/disputes/pending", getPendingDisputes);
router.get("/disputes/active", getActiveDisputes);
router.get("/disputes/resolved", getResolvedDisputes);
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
