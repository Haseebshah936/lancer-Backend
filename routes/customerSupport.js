const router = require("express").Router();

router.get("/", getCustomerSupportIssues);
router.get("/dispute/", getDisputes);
router.get("/pending", getPendingDisputes);
router.get("/inProgress", getInProgressDisputes);
router.get("/solved", getSolvedDisputes);
router.get("/:id", getDispute);
router.post("/", createDispute);
router.put("/:id", updateDispute);
router.put("/:id/inProgress", inProgressDispute);
router.put("/:id/resolve", resolveDispute);
router.put("/:id/asignHandler", assignDisputeHandler);
router.delete("/:id", deleteDispute);

module.exports = router;
