const moongose = require("mongoose");

const categorySchema = moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  features: [{ type: String, required: true }],
  additionalFeatures: [{ type: String, default: "" }],
  createdAt: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
});

module.exports = moongose.model("Category", categorySchema);
