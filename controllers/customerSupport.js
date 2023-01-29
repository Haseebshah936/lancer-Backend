const { Chatroom, Participant } = require("../models/chatroom");
const { User } = require("../models/user");
const CustomerSupport = require("../models/customerSupport");
const { Project } = require("../models/project");
const {
  sendSoftNotification,
  sendHardNotification,
} = require("../utils/notification");

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
      state: "pending",
    })
      .populate("creatorId resolvers.userId", "name email badge profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(10);
    res.status(200).send(issues);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const getAptitudeTestDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: "aptitudeTest",
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
const getOtherDisputes = async (req, res) => {
  try {
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType: {
        $in: ["other", "spam"],
      },
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

const getActiveDisputesByResolverId = async (req, res) => {
  try {
    const { resolverId, requestType = "dispute" } = req.params;
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType,
      resolvers: {
        $elemMatch: {
          _id: resolverId,
        },
      },
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

const getResolvedDisputesByResolverId = async (req, res) => {
  try {
    const { resolverId, requestType = "dispute" } = req.params;
    let { skip } = req.query;
    if (skip === undefined) skip = 0;
    const issues = await CustomerSupport.find({
      requestType,
      resolvers: {
        $elemMatch: {
          _id: resolverId,
        },
      },
      state: "resolved",
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
    const { creatorId, categoryId } = req.params;
    const issues = await CustomerSupport.find({
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
      createdAt: { $gte: Date.now() - 180 * 24 * 60 * 60 * 1000 },
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
    const { creatorId, disputeReason } = req.body;
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
      disputeReason,
    });
    const response = await newDispute.save();
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createSpamDispute = async (req, res) => {
  try {
    let { creatorId, disputeReason, chatroomId } = req.body;
    if (disputeReason == undefined) disputeReason = "Spam in chat";
    const newDispute = new CustomerSupport({
      creatorId,
      requestType: "spam",
      disputeReason,
      chatroomId,
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
    res.status(200).send(dispute);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const activateDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolverId } = req.body;
    const dispute = await CustomerSupport.findById(id);
    if (!dispute) return res.status(404).send("Dispute not found");
    if (dispute.state === "active") {
      return res.status(403).send("Dispute Already Activated");
    }
    const user = await User.findById(dispute.creatorId).select("name email");
    if (!user) return res.status(404).send("User not found");
    dispute.resolvers.push(resolverId);
    if (!dispute.chatroomId) {
      const participants = [
        new Participant({
          userId: dispute.creatorId,
        }),
        new Participant({
          userId: resolverId,
          isAdmin: true,
        }),
      ];
      if (dispute.requestType === "dispute") {
        console.log("in dispute");
        const project = await Project.findById(dispute.projectId);
        if (!project) return res.status(404).send("Project not found");
        participants.push(
          new Participant({
            userId: project.hired.userId,
          })
        );
      }
      const chatroom = new Chatroom({
        participants,
        creatorId: resolverId,
        description: dispute.disputeReason,
        groupName: user.name,
        isGroup: true,
        isCustomerSupport: true,
      });
      console.log(chatroom);
      chatroom.save();

      dispute.chatroomId = chatroom._id;
    }
    dispute.state = "active";
    dispute.save();

    res.status(200).send(dispute);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolverId, details } = req.body;
    const dispute = await CustomerSupport.findById(id);
    if (!dispute) return res.status(404).send("Dispute not found");
    dispute.state = "resolved";
    const chatroom = await Chatroom.findById(dispute.chatroomId).populate(
      "participants.userId",
      "name profilePic badge isOnline subscription"
    );
    chatroom.state = "archived";
    dispute.resolvedBy = resolverId;
    dispute.resolvedAt = Date.now();
    dispute.details = details;
    await chatroom.save();
    const response = await dispute.save();
    const title = "Dispute Resolved";
    const text = details;
    const image = null;
    chatroom.participants.forEach(async (participant) => {
      const { subscription, id } = participant.userId;
      if (id.toString() !== resolverId) {
        if (subscription) {
          sendSoftNotification(subscription, title, text, image);
        }
        sendHardNotification(
          title,
          text,
          "customerSupport",
          id,
          null,
          dispute.projectId,
          resolverId
        );
      }
    });
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
    // if (issue.chatroomId) {
    chatroom = await Chatroom.findById(issue.chatroomId);
    chatroom.participants.push(
      new Participant({
        userId: resolverId,
        isAdmin: true,
      })
    );
    // } else {
    //   chatroom = new Chatroom({
    //     participants: [
    //       new Participant({
    //         userId: issue.creatorId,
    //       }),
    //       new Participant({
    //         userId: resolverId,
    //         isAdmin: true,
    //       }),
    //     ],
    //     creatorId: resolverId,
    //     description: issue.details,
    //     groupName: "Customer Support",
    //     isGroup: true,
    //     isCustomerSupport: true,
    //   });
    //   issue.chatroomId = chatroom._id;
    // }
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

const deleteAllDisputes = async (req, res) => {
  try {
    const disputes = await CustomerSupport.deleteMany();
    res.status(200).send("Desputes deleted successfully");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getCustomerSupportIssues,
  getActiveDisputesByResolverId,
  getResolvedDisputesByResolverId,
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
  createSpamDispute,
  updateOtherIssue,
  updateDispute,
  activateDispute,
  resolveDispute,
  becomeResolver,
  deleteIssue,
  deleteAllDisputes,
};
