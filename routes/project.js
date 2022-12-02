const router = require("express").Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.get("/creator/:creatorId", getProjectsByCreatorId);
router.get("/creator/pending/:creatorId", getProjectsAsCreator_pending);
router.get("/creator/onGoing/:creatorId", getProjectsAsCreator_onGoing);
router.get("/creator/completed/:creatorId", getProjectsAsCreator_completed);
router.get("/creator/cancelled/:creatorId", getProjectsAsCreator_cancelled);
router.get("/seller/:sellerId", getProjectsBySellerId);
router.get("/seller/pending/:creatorId", getProjectsAsSeller_pending);
router.get("/seller/onGoing/:creatorId", getProjectsAsSeller_onGoing);
router.get("/seller/completed/:creatorId", getProjectsAsSeller_completed);
router.get("/seller/cancelled/:creatorId", getProjectsAsSeller_cancelled);
router.post("/", createProject);
router.put("/:id", updateProject);
router.put("/start/:id", startProject);
router.put("/delivery/:id", projectDelivery);
router.put("/revision/:id", projectRevision);
router.put("/createExtension/:id", extendProject);
router.put("/updateExtension/:id", updateProjectExtension);
router.put("/complete/:id", completeProject);
router.put("/cancel/:id", cancelProject);
router.delete("/despute/:id", desputeProject);
router.delete("/:id", deleteProject);

module.exports = router;
