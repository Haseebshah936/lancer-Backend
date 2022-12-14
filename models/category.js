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
      type: {
        type: String,
        default: "",
        enum: ["", "quantity", "time", "timeAndQuantity"],
      },
    },
  ],
  additionalFeatures: [
    {
      title: { type: String, required: true },
      type: {
        type: String,
        default: "",
        enum: ["", "quantity", "time", "timeAndQuantity"],
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  count: { type: Number, default: 0 },
});
const Category = moongose.model("Category", categorySchema);
module.exports = Category;
