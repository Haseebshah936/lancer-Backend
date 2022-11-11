const moongose = require("mongoose");

const categorySchema = new moongose.Schema({
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
  features: [
    {
      title: { type: String, required: true },
      quantityBased: { type: Boolean, default: false },
    },
  ],
  additionalFeatures: [
    {
      title: { type: String, required: true },
      quantityBased: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
});
const Category = moongose.model("Category", categorySchema);
module.exports = Category;
