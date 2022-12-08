const {
  getProposals,
  getProposal,
  getProposalsByUserId,
  getActiveProposalsByUserId,
  getAcceptedProposalsByUserId,
  getProposalsByProjectId,
  getProposalsByProjectId_active,
  getProposalsByProjectId_rejected,
  getProposalsByProjectId_accepted,
  getProposalsByProjectId_cancelled,
  createProposal,
  updateProposal,
  acceptProposal,
  rejectProposal,
  cancelProposal,
  deleteProposal,
  activeProposal,
} = require("../controllers/proposal");

const router = require("express").Router();

router.get("/", getProposals);
router.get("/:id", getProposal);
router.get("/user/:userId", getProposalsByUserId);
router.get("/user/active/:userId", getActiveProposalsByUserId);
router.get("/user/accepted/:userId", getAcceptedProposalsByUserId);
router.get("/product/:projectId", getProposalsByProjectId);
router.get("/active/:projectId", getProposalsByProjectId_active);
router.get("/rejected/:projectId", getProposalsByProjectId_rejected);
router.get("/accepted/:projectId", getProposalsByProjectId_accepted);
router.get("/cancelled/:projectId", getProposalsByProjectId_cancelled);
router.post("/", createProposal);
router.put("/:id", updateProposal);
router.put("/accept/:id", acceptProposal);
router.put("/reject/:id", rejectProposal);
router.put("/cancel/:id", cancelProposal);
router.put("/active/:id", activeProposal);
router.delete("/:id", deleteProposal);

module.exports = router;
