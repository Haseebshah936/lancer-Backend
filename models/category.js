const moongose = require("mongoose");

const categorySchema = moongose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
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
