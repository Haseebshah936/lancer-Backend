const CustomerSupport = mongoose.model("../models/customerSupport");

const createDispute = async (req, res) => {
  try {
    const { creatorId, details, disputeReason, category, projectId } = req.body;
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
      details,
      disputeReason,
      category,
      projectId,
    });
    const response = await newDispute.save();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {};
