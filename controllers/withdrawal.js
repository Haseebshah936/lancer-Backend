const { Withdrawal, AccountDetail } = require("../models/withdrawal");
const { User } = require("../models/user");
const {
  sendSoftNotification,
  sendHardNotification,
} = require("../utils/notification");

const getWithdrawls = async (req, res) => {
  try {
    const withdrawls = await Withdrawal.find();
    res.status(200).json(withdrawls);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getWithdrawl = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawl = await Withdrawal.findById(id);
    res.status(200).json(withdrawl);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPendingWithdrawls = async (req, res) => {
  try {
    const withdrawls = await Withdrawal.find({ status: "pending" });
    res.status(200).json(withdrawls);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getApprovedWithdrawls = async (req, res) => {
  try {
    const withdrawls = await Withdrawal.find({ status: "approved" });
    res.status(200).json(withdrawls);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getRejectedWithdrawls = async (req, res) => {
  try {
    const withdrawls = await Withdrawal.find({ status: "rejected" });
    res.status(200).json(withdrawls);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getWithdrawlsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const Withdrawals = await Withdrawal.find({ userId: id });
    res.status(200).json(Withdrawals);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getPendingWithdrawlsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawals = await Withdrawal.find({
      userId: id,
      status: "pending",
    });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getApprovedWithdrawlsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawals = await Withdrawal.find({
      userId: id,
      status: "approved",
    });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getRejectedWithdrawlsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawals = await Withdrawal.find({
      userId: id,
      status: "rejected",
    });
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createWithdrawl = async (req, res) => {
  try {
    const { userId, amount, IBAN, accountHolderName } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");
    if (user.currentBalance < amount || user.currentBalance < 20)
      return res.status(400).json("Insufficient balance");
    const accountDetail = new AccountDetail({
      IBAN,
      accountHolderName,
    });
    const newWithdrawl = new Withdrawal({
      userId,
      amount,
      accountDetail,
    });
    user.currentBalance -= amount;
    await user.save();
    const withdrawal = await newWithdrawl.save();
    res.status(200).json(withdrawal);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, IBAN, accountHolderName } = req.body;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json("Withdrawl not found");

    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");
    if (user.currentBalance < amount || user.currentBalance < 20)
      return res.status(400).json("Insufficient balance");

    withdrawal.amount = amount;
    withdrawal.accountDetail.IBAN = IBAN;
    withdrawal.accountDetail.accountHolderName = accountHolderName;
    await withdrawal.save();
    res.status(200).json(withdrawal);
  } catch (error) {
    res.status(500).json(error);
  }
};

const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json("Withdrawl not found");
    if (withdrawal.status === "approved")
      return res.status(400).json("Withdrawl already approved");
    withdrawal.status = "approved";
    withdrawal.completionDate = Date.now();
    await withdrawal.save();
    const user = await User.findById(withdrawal.userId);
    const title = "Withdrawal Approved";
    const text = `Your withdrawal request of ${withdrawal.amount} has been approved`;
    const image = null;
    if (user.subscription) {
      sendSoftNotification(user.subscription, title, text, image);
    }
    sendHardNotification(
      title,
      text,
      "info",
      withdrawal.userId,
      null,
      null,
      null
    );
    res.status(200).json(withdrawal);
  } catch (error) {
    res.status(500).json(error);
  }
};

const rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) return res.status(404).json("Withdrawl not found");
    if (withdrawal.status !== "pending")
      return res.status(400).json("Withdrawl already completed");
    withdrawal.status = "rejected";
    withdrawal.completionDate = Date.now();
    await withdrawal.save();
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteWithdrawl = async (req, res) => {
  try {
    const { id } = req.params;
    const widthdrawl = await Withdrawal.findById(id);
    if (!widthdrawl) return res.status(404).json("Withdrawl not found");
    await widthdrawl.delete();
    res.status(200).json("Withdrawl deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteAllWithdrawls = async (req, res) => {
  try {
    await Withdrawal.deleteMany();
    res.status(200).json("All Withdrawls deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getWithdrawls,
  getWithdrawl,
  getPendingWithdrawls,
  getApprovedWithdrawls,
  getRejectedWithdrawls,
  getWithdrawlsByUserId,
  getPendingWithdrawlsByUserId,
  getApprovedWithdrawlsByUserId,
  getRejectedWithdrawlsByUserId,
  createWithdrawl,
  updateWithdrawal,
  approveWithdrawal,
  rejectWithdrawal,
  deleteWithdrawl,
  deleteAllWithdrawls,
};
