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
} = require("../controllers/project");

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
router.put("/hired/:id", hiredProjectWorker);
router.put("/requestRequirement/:id", requestRequirement);
router.put("/provideRequirement/:id", provideRequirement);
router.put("/start/:id", startProject);
router.put("/deliver/:id", deliverProject);
router.put("/revision/:id", reviseProject);
router.put("/createExtension/:id", extendProject);
router.put("/acceptExtension/:id", acceptProjectExtension);
router.put("/rejectExtension/:id", rejectProjectExtension);
router.delete("/despute/:id", disputeProject);
router.put("/cancel/:id", cancelProject);
router.put("/complete/:id", completeProject);
router.delete("/:id", deleteProject);

module.exports = router;
