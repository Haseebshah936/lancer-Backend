const {
  getProjects,
  getProject,
  getProjectsByCreatorId,
  getProjectsAsCreator_pending,
  getProjectsAsCreator_onGoing,
  getProjectsAsCreator_completed,
  getProjectsAsCreator_cancelled,
  getProjectsBySellerId,
  getProjectsAsSeller_pending,
  getProjectsAsSeller_onGoing,
  getProjectsAsSeller_completed,
  getProjectsAsSeller_cancelled,
  getProjectsBetween,
  createProject,
  updateProject,
  startProject,
  deliverProject,
  reviseProject,
  extendProject,
  acceptProjectExtension,
  rejectProjectExtension,
  disputeProject,
  cancelProject,
  completeProject,
  deleteProject,
  hiredProjectWorker,
  requestRequirement,
  provideRequirement,
  getProjectsByCategory,
  getPendingProjects,
  getOnGoingProjects,
  deleteProjects,
  deliverRequirement,
  getProjectsAsCreator_pendingCount,
  getProjectsAsCreator_onGoingCount,
  getProjectsAsCreator_completedCount,
  getProjectsAsCreator_cancelledCount,
  getProjectsAsSeller_pendingCount,
  getProjectsAsSeller_onGoingCount,
  getProjectsAsSeller_completedCount,
  getProjectsAsSeller_cancelledCount,
} = require("../controllers/project");

const router = require("express").Router();

router.get("/", getProjects);
router.get("/pending/:userId", getPendingProjects);
router.get("/onGoing", getOnGoingProjects);
router.get("/", getProjects);
router.get("/:id", getProject);
router.get("/creator/:creatorId", getProjectsByCreatorId);
router.get("/category/:categoryId", getProjectsByCategory);
router.get("/creator/pending/:creatorId", getProjectsAsCreator_pending);
router.get(
  "/creator/pendingCount/:creatorId",
  getProjectsAsCreator_pendingCount
);
router.get("/creator/onGoing/:creatorId", getProjectsAsCreator_onGoing);
router.get(
  "/creator/onGoingCount/:creatorId",
  getProjectsAsCreator_onGoingCount
);
router.get("/creator/completed/:creatorId", getProjectsAsCreator_completed);
router.get(
  "/creator/completedCount/:creatorId",
  getProjectsAsCreator_completedCount
);
router.get("/creator/cancelled/:creatorId", getProjectsAsCreator_cancelled);
router.get(
  "/creator/cancelledCount/:creatorId",
  getProjectsAsCreator_cancelledCount
);
router.get("/seller/:sellerId", getProjectsBySellerId);
router.get("/seller/pending/:sellerId", getProjectsAsSeller_pending);
router.get("/seller/pendingCount/:sellerId", getProjectsAsSeller_pendingCount);
router.get("/seller/onGoing/:sellerId", getProjectsAsSeller_onGoing);
router.get("/seller/onGoingCount/:sellerId", getProjectsAsSeller_onGoingCount);
router.get("/seller/completed/:sellerId", getProjectsAsSeller_completed);
router.get(
  "/seller/completedCount/:sellerId",
  getProjectsAsSeller_completedCount
);
router.get("/seller/cancelled/:sellerId", getProjectsAsSeller_cancelled);
router.get(
  "/seller/cancelledCount/:sellerId",
  getProjectsAsSeller_cancelledCount
);
router.get("/projectBetween/:creatorId/:sellerId", getProjectsBetween);
router.post("/", createProject);
router.put("/:id", updateProject);
router.put("/hired/:id", hiredProjectWorker);
router.put("/requestRequirement/:id", requestRequirement);
router.put("/provideRequirement/:id", provideRequirement);
router.put("/deliverRequirement/:id", deliverRequirement);
router.put("/start/:id", startProject);
router.put("/deliver/:id", deliverProject);
router.put("/revision/:id", reviseProject);
router.put("/createExtension/:id", extendProject);
router.put("/acceptExtension/:id", acceptProjectExtension);
router.put("/rejectExtension/:id", rejectProjectExtension);
router.put("/dispute/:id", disputeProject);
router.put("/cancel/:id", cancelProject);
router.put("/complete/:id", completeProject);
router.delete("/:id", deleteProject);
router.delete("/", deleteProjects);

module.exports = router;
