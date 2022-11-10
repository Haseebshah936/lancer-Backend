const moongose = require("mongoose");

const featureSchema = moongose.Schema({
  title: { type: String, required: true },
  active: { type: Boolean, required: true },
  quantity: { type: Number, default: 0, required: true },
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
  features: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "Feature",
      required: true,
    },
  ],
});

const productSchema = moongose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{ type: String, required: true }],
  video: { type: String, default: "" },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  packages: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
  ],
  additionalFeatures: [
    {
      title: { type: String, required: true },
      active: { type: Boolean, required: true, default: false },
      cost: { type: Number, default: 0, required: true },
    },
  ],
  ownerId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = moongose.model("Feature", featureSchema);
module.exports = moongose.model("Package", packageSchema);
module.exports = moongose.model("Product", productSchema);
