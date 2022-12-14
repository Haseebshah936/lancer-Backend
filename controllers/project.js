const mongoose = require("mongoose");
const {
  Project,
  Hiring,
  Delivery,
  Extension,
  Cancellation,
  Requirenment,
} = require("../models/project");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("creatorId hired.userId", "name profilePic badge")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getPendingProjects = async (req, res) => {
  try {
    let { skip } = req.qurey;
    if (!skip) skip = 0;
    const projects = await Project.find({
      state: "pending",
    })
      .populate("creatorId", "name profilePic badge")
      .sort({ createdAt: -1 });
    // .limit(10)
    // .skip(skip)
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOnGoingProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      state: {
        $in: [
          "onGoing",
          "delivered",
          "revision",
          "extended",
          "disputed",
          "requirementGathering",
        ],
      },
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .limit(10)
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate(
      "creatorId hired.userId",
      "name profilePic badge"
    );
    if (!project) return res.status(404).send("No project found");
    res.status(200).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsByCreatorId = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const projects = await Project.find({
      creatorId,
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const projects = await Project.find({
      category: categoryId,
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsCreator_pending = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const projects = await Project.find({
      creatorId,
      state: "pending",
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsCreator_onGoing = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const projects = await Project.find({
      creatorId,
      state: {
        $in: [
          "onGoing",
          "delivered",
          "revision",
          "extended",
          "disputed",
          "requirementGathering",
        ],
      },
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsCreator_completed = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const projects = await Project.find({
      creatorId,
      state: "completed",
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsCreator_cancelled = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const projects = await Project.find({
      creatorId,
      state: "cancelled",
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const projects = await Project.find({
      "hired.userId": sellerId,
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsSeller_pending = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const projects = await Project.find({
      "hired.userId": sellerId,
      state: "pending",
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsSeller_onGoing = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const projects = await Project.find({
      "hired.userId": sellerId,
      state: {
        $in: [
          "onGoing",
          "delivered",
          "revision",
          "extended",
          "disputed",
          "requirementGathering",
        ],
      },
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsSeller_completed = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const projects = await Project.find({
      "hired.userId": sellerId,
      state: "completed",
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectsAsSeller_cancelled = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const projects = await Project.find({
      "hired.userId": sellerId,
      state: "cancelled",
    })
      .populate("creatorId hired.userId", "name profilePic badge")
      .sort({ createdAt: -1 });
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

const requestRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("No project found");
    const requirement = new Requirenment({
      state: "pending",
    });
    project.requirenments.push(requirement);
    project.markModified("requirements");
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    console.log(
      "🚀 ~ file: project.js:176 ~ requestRequirement ~ error",
      error
    );

    res.status(500).send(error);
  }
};

const provideRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { requirementId, files, links, details } = req.body;
    const project = await Project.findOneAndUpdate(
      {
        _id: id,
        "requirenments._id": requirementId,
      },
      {
        $set: {
          "requirenments.$.state": "provided",
          "requirenments.$.files": files,
          "requirenments.$.links": links,
          "requirenments.$.details": details,
        },
      },
      { new: true }
    );
    if (!project) return res.status(404).send("No project found");
    res.status(201).send(project);
  } catch (error) {
    console.log(
      "🚀 ~ file: project.js:199 ~ provideRequirement ~ error",
      error
    );

    res.status(500).send(error);
  }
};

const createProject = async (req, res) => {
  try {
    const {
      creatorId,
      title,
      category,
      description,
      budget,
      pricingType,
      days,
      experties,
      files,
      links,
    } = req.body;
    console.log(req.body);
    const project = new Project({
      creatorId,
      title,
      category,
      description,
      budget,
      pricingType,
      days,
      experties,
      files,
      links,
    });
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      description,
      budget,
      pricingType,
      days,
      skills,
      experties,
      files,
      links,
    } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.title = title;
    project.category = category;
    project.description = description;
    project.budget = budget;
    project.pricingType = pricingType;
    project.days = days;
    project.skills = skills;
    project.experties = experties;
    project.files = files;
    project.links = links;
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

const hiredProjectWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerId, productId } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "requirementGathering";
    project.startedAt = Date.now();
    const hired = new Hiring({
      userId: sellerId,
      productId,
    });
    project.hired = hired;
    project.markModified("hired");
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

const startProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { files, links, details } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "onGoing";
    project.completionDate = Date.now() + project.days * 24 * 60 * 60 * 1000;
    project.requirenments.push(
      new Requirenment({ files, links, details, state: "provided" })
    );
    project.markModified("requirenments");
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deliverProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { files, links, details } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "delivered";
    const delivery = new Delivery({
      files,
      links,
      details,
    });
    project.delivery.push(delivery);
    project.markModified("delivery");
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const reviseProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryId, reason } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "revision";
    project.delivery.id(deliveryId).state = "rejected";
    project.delivery.id(deliveryId).reason = reason;
    project.markModified("delivery");
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const extendProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, days } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "extended";
    const extension = new Extension({
      reason,
      days,
    });
    project.extension.push(extension);
    project.markModified("extension");
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const acceptProjectExtension = async (req, res) => {
  try {
    const { id } = req.params;
    const { extensionId } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "onGoing";
    project.extension.id(extensionId).state = "accepted";
    project.completionDate =
      Date.now() +
      (project.days + project.extension.id(extensionId).days) *
        24 *
        60 *
        60 *
        1000;
    project.markModified("extension");
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const rejectProjectExtension = async (req, res) => {
  try {
    const { id } = req.params;
    const { extensionId } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "onGoing";
    project.extension.id(extensionId).state = "rejected";
    project.markModified("extension");
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    console.log(
      "🚀 ~ file: project.js:403 ~ rejectProjectExtension ~ error",
      error
    );

    res.status(500).send(error);
  }
};

const disputeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "disputed";
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const cancelProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reason, canceller } = req.body;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "cancelled";
    project.cancellation = new Cancellation({
      userId,
      reason,
      canceller,
    });
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const completeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send("Project not found");
    project.state = "completed";
    project.completedAt = Date.now();
    const response = await project.save();
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).send("Project not found");
    res.status(200).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  getPendingProjects,
  getOnGoingProjects,
  getProjectsByCreatorId,
  getProjectsByCategory,
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
  hiredProjectWorker,
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
  requestRequirement,
  provideRequirement,
};
