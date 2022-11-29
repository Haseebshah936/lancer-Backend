const moongose = require("mongoose");

const featureSchema = new moongose.Schema({
  title: { type: String, required: true },
  active: { type: Boolean, required: true },
  quantity: { type: Number, default: 0, required: true },
});

const additionalFeaturesSchema = new moongose.Schema({
  title: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
  cost: { type: Number, default: 0, required: true },
});

const packageSchema = new moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  delivery: {
    type: Number,
    required: true,
  },
  features: [featureSchema],
});

const productSchema = new moongose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner: {
    _id: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badge: {
      type: String,
    },
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  description: { type: String, default: "" },
  images: [{ type: String, required: true }],
  videos: [{ type: String, default: "" }],
  createdAt: { type: Date, default: Date.now },
  packages: [packageSchema],
  additionalFeatures: [additionalFeaturesSchema],
  orderImages: [{ type: String, default: "" }],
  orderVideos: [{ type: String, default: "" }],
  state: {
    type: String,
    default: "pending",
  },
  reviews: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ranking: {
    type: Number,
    default: 0,
  },
  cost: {
    type: Number,
    default: 5,
    required: true,
  },
  questions: [
    {
      title: { type: String, required: true },
      discription: { type: String, required: true },
    },
  ],
});
const Product = moongose.model("Product", productSchema);
const Package = moongose.model("Package", packageSchema);
const Feature = moongose.model("Feature", featureSchema);
const AdditionalFeature = moongose.model(
  "AdditionalFeature",
  additionalFeaturesSchema
);
module.exports = { Product, Package, Feature, AdditionalFeature };
