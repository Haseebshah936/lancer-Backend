const { Chatroom, Participant } = require("../models/chatroom");
const CustomerSupport = require("../models/customerSupport");

const getCustomerSupportIssues = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find()
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await CustomerSupport.findById(id).populate(
      "creatorId",
      "name email badge profilePic"
    );
    if (!issue) return res.status(404).send("Issue not found");
    res.status(200).send(issue);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProjectDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "dispute",
    })
      .populate("creatorId resolvers.userId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAptitudeTestDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "aptitudeTest",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getOtherDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "other",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "dispute",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDisputesByCreatorId = async (req, res) => {
  try {
    const { creatorId } = req.params;
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      creatorId,
      state: "pending",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAptitudeTestDisputeByCreatorId = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const issues = await CustomerSupport.findOne({
      creatorId,
      state: "pending",
      requestType: "aptitudeTest",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 });
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getPendingDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "dispute",
      state: "pending",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getActiveDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "dispute",
      state: "active",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getResolvedDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "dispute",
      state: "active",
    })
      .populate("creatorId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createOtherIssue = async (req, res) => {
  try {
    const { creatorId, details, request } = req.body;
    const newDispute = new CustomerSupport({
      creatorId,
      requestType: "other",
      request,
      details,
    });
    const response = await newDispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateOtherIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { details, request } = req.body;
    const dispute = await CustomerSupport.findById(id);
    if (!dispute) return res.status(404).send("Dispute not found");
    const newDispute = new CustomerSupport({
      request,
      details,
    });
    const response = await newDispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createProjectDispute = async (req, res) => {
  try {
    const { creatorId, disputeReason, projectId } = req.body;
    const dispute = await CustomerSupport.findOne({
      creatorId,
      requestType: "dispute",
      state: "pending",
      projectId,
    });
    if (dispute)
      return res
        .status(400)
        .send("You already have a pending dispute for this project");
    const newDispute = new CustomerSupport({
      creatorId,
      requestType: "dispute",
      disputeReason,
      projectId,
    });
    const response = await newDispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createAptitudeTestDispute = async (req, res) => {
  try {
    const { creatorId, disputeReason, categoryId } = req.body;
    const dispute = await CustomerSupport.findOne({
      creatorId,
      requestType: "aptitudeTest",
      state: "pending",

      category: categoryId,
      createdAt: { $gte: Date.now() - 24 * 60 * 60 * 1000 },
    });
    if (dispute)
      return res.status(400).send("You already requested an aptitude Test.");
    const newDispute = new CustomerSupport({
      creatorId,
      requestType: "aptitudeTest",
      disputeReason,
      category: categoryId,
    });
    const response = await newDispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createOtherDispute = async (req, res) => {
  try {
    const { creatorId, details } = req.body;
    const dispute = await CustomerSupport.findOne({
      creatorId,
      requestType: "other",
      state: "pending",
    });
    if (dispute)
      return res.status(400).send("You already have a pending dispute.");
    const newDispute = new CustomerSupport({
      creatorId,
      requestType: "other",
      details,
    });
    const response = await newDispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { details, disputeReason } = req.body;
    const dispute = await CustomerSupport.findById(id);
    if (!dispute) return res.status(404).send("Dispute not found");
    dispute.details = details;
    dispute.disputeReason = disputeReason;
    dispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const activateDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await CustomerSupport.findById(id);
    if (!dispute) return res.status(404).send("Dispute not found");
    dispute.state = "active";
    dispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const dispute = await CustomerSupport.findById(id);
    if (!dispute) return res.status(404).send("Dispute not found");
    dispute.state = "resolved";
    const chatroom = await Chatroom.findById(dispute.chatroomId);
    chatroom.state = "archived";
    dispute.resolvedAt = Date.now();
    await chatroom.save();
    const response = await dispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const becomeResolver = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolverId } = req.body;
    const issue = await CustomerSupport.findById(id);
    if (!issue) return res.status(404).send("Issue not found");
    issue.resolvers.push(resolverId);
    let chatroom;
    if (issue.chatroomId) {
      chatroom = await Chatroom.findById(issue.chatroomId);
      chatroom.participants.push(
        new Participant({
          userId: resolverId,
          isAdmin: true,
        })
      );
    } else {
      chatroom = new Chatroom({
        participants: [
          new Participant({
            userId: issue.creatorId,
          }),
          new Participant({
            userId: resolverId,
            isAdmin: true,
          }),
        ],
        creatorId: resolverId,
        description: issue.details,
        groupName: "Customer Support",
        isGroup: true,
        isCustomerSupport: true,
      });
      issue.chatroomId = response._id;
    }
    await chatroom.save();
    const response = await issue.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await CustomerSupport.findByIdAndDelete(id);
    if (!issue) return res.status(404).send("Issue not found");
    res.status(200).send("Issue deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getCustomerSupportIssues,
  getDisputes,
  getDispute,
  getPendingDisputes,
  getActiveDisputes,
  getResolvedDisputes,
  getDisputesByCreatorId,
  getAptitudeTestDisputeByCreatorId,
  getProjectDisputes,
  getAptitudeTestDisputes,
  getOtherDisputes,
  createProjectDispute,
  createAptitudeTestDispute,
  createOtherDispute,
  createOtherIssue,
  updateOtherIssue,
  updateDispute,
  activateDispute,
  resolveDispute,
  becomeResolver,
  deleteIssue,
};
