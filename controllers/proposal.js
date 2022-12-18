const mongoose = require("mongoose");
const { Project } = require("../models/project");
const Proposal = require("../models/proposal");

const getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });

    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id)
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    if (!proposal) {
      res.status(404).send("Proposal not found");
    }
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposalsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const proposals = await Proposal.find({ creatorId: userId })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getActiveProposalsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const proposals = await Proposal.find({
      creatorId: userId,
      state: "active",
    })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAcceptedProposalsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const proposals = await Proposal.find({
      creatorId: userId,
      state: "accepted",
    })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposalsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proposals = await Proposal.find({ projectId })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposalsByProjectId_active = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proposals = await Proposal.find({ projectId, state: "active" })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposalsByProjectId_accepted = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proposals = await Proposal.find({ projectId, state: "accepted" })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposalsByProjectId_rejected = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proposals = await Proposal.find({ projectId, state: "rejected" })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProposalsByProjectId_cancelled = async (req, res) => {
  try {
    const { projectId } = req.params;
    const proposals = await Proposal.find({ projectId, state: "cancelled" })
      .populate("creatorId productId", "name profilePic badge title images")
      .sort({ createdAt: -1 });
    res.status(200).send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createProposal = async (req, res) => {
  try {
    const { projectId, creatorId, productId, description, budget, duration } =
      req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).send("Project not found");
    let proposal = await Proposal.findOne({ creatorId, productId });
    if (proposal) {
      res.status(409).send("Proposal already exists");
      return;
    }
    proposal = new Proposal({
      projectId,
      creatorId,
      productId,
      description,
      budget,
      duration,
    });
    project.proposalCount++;
    project.proposals.push(creatorId);
    await project.save();
    await proposal.save();
    res.status(201).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId, creatorId, productId, description, budget, duration } =
      req.body;
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).send("Proposal not found");
      return;
    }
    proposal.projectId = projectId;
    proposal.creatorId = creatorId;
    proposal.productId = productId;
    proposal.description = description;
    proposal.budget = budget;
    proposal.duration = duration;
    await proposal.save();
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const acceptProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).send("Proposal not found");
      return;
    }
    proposal.state = "accepted";
    await proposal.save();
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const activeProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).send("Proposal not found");
      return;
    }
    proposal.state = "active";
    await proposal.save();
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const rejectProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).send("Proposal not found");
      return;
    }
    proposal.state = "rejected";
    await proposal.save();
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const cancelProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).send("Proposal not found");
      return;
    }
    proposal.state = "cancelled";
    await proposal.save();
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const proposal = await Proposal.findById(id);
    if (!proposal) {
      res.status(404).send("Proposal not found");
      return;
    }
    await proposal.delete();
    res.status(200).send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getProposals,
  getProposal,
  getProposalsByUserId,
  getActiveProposalsByUserId,
  getAcceptedProposalsByUserId,
  getProposalsByProjectId,
  getProposalsByProjectId_active,
  getProposalsByProjectId_accepted,
  getProposalsByProjectId_rejected,
  getProposalsByProjectId_cancelled,
  createProposal,
  updateProposal,
  acceptProposal,
  rejectProposal,
  cancelProposal,
  activeProposal,
  deleteProposal,
};
