const moongose = require("mongoose");
lancerSchema = new moongose.Schema({
  totalUsers: {
    type: Number,
    default: 0,
  },
  totalFreelancers: {
    type: Number,
    default: 0,
  },
  totalAdmins: {
    type: Number,
    default: 0,
  },
  totalEmployers: {
    type: Number,
    default: 0,
  },
  totalOnGoingProjects: {
    type: Number,
    default: 0,
  },
  totalCompletedProjects: {
    type: Number,
    default: 0,
  },
  totalCancelledProjects: {
    type: Number,
    default: 0,
  },
  totalEarning: {
    type: Number,
    default: 0,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  totalWithdrawal: {
    type: Number,
    default: 0,
  },
});
