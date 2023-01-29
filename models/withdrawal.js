const mongoose = require("mongoose");

const accountDetailSchema = new mongoose.Schema({
  IBAN: {
    type: String,
    required: true,
  },
  accountHolderName: {
    type: String,
    required: true,
  },
});

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  accountDetail: accountDetailSchema,
  completionDate: {
    type: Date,
  },
});

const AccountDetail = mongoose.model("AccountDetail", accountDetailSchema);
const Withdrawal = mongoose.model("Widthdrawl", withdrawalSchema);

module.exports = { AccountDetail, Withdrawal };
