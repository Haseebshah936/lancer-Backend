const mongoose = require("mongoose");
const { findOrCreate } = require("../utils/auth");

const sellerSchema = new mongoose.Schema({
  skills: [
    {
      type: String,
      required: true,
    },
  ],
  about: {
    type: String,
    required: true,
  },
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      starting: {
        type: String,
        required: true,
      },
      ending: {
        type: String,
        default: "Present",
      },
    },
  ],
  education: [
    {
      degree: {
        type: String,
        required: true,
      },
      institute: {
        type: String,
        required: true,
      },
      starting: {
        type: String,
        required: true,
      },
      ending: {
        type: String,
        default: "Present",
      },
    },
  ],
  achivements: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      starting: {
        type: String,
        required: true,
      },
      ending: {
        type: String,
        default: "Present",
      },
    },
  ],
  languages: [
    {
      language: {
        type: String,
        required: true,
      },
      proficiency: {
        type: String,
        required: true,
      },
    },
  ],
  englishLevel: {
    type: String,
    required: true,
  },
  activeOrders: { type: Number, default: 0 },
  cancelledOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    default: 5,
  },
  tagLine: {
    type: String,
    default: "I am a freelancer",
  },
  emailVerified: { type: Boolean, default: false },
  googleId: { type: String, default: null },
  facebookId: { type: String, default: null },
  twitterId: { type: String, default: null },
  role: { type: String, default: "user" },
  profilePic: { type: String, default: "" },
  country: { type: String, default: "" },
  currency: { type: String, default: "USD" },
  seller: { type: sellerSchema, default: null },
  recentSearches: [{ type: String, default: "" }],
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  //   followers: [{ type: mongoose.Types.ObjectId, ref: "User" }], // converted to collection
  // following: [{ type: mongoose.Types.ObjectId, ref: "User" }], //converted to collection
  // gigs:[{type:mongoose.Types.ObjectId, ref:"Gig"}], //converted to collection
  // orders:[{type:mongoose.Types.ObjectId, ref:"Order"}],//converted to collection
  // reviews:[{type:mongoose.Types.ObjectId, ref:"Review"}],//converted to collection
  isOnline: { type: Date },
  reviews: { type: Number, default: 0 },
  responseTime: { type: Number, default: 0 },
  stars: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
  badge: { type: String, default: "Newbie" },
  currentBalance: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  gender: { type: String },
  DOB: { type: Date },
});
// userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = { User, Seller };
