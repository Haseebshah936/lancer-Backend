const moongose = require("mongoose");

const subCategorySchema = moongose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: moongose.Schema.Types.ObjectId,
    required: true,
  },
  subTypes: {
    type: [{ type: moongose.Schema.Types.ObjectId, default: "" }],
  },
  features: {
    type: [{ type: String, default: "" }],
    validate: {
      validator: function (v) {
        return v.length > 1;
      },
      message: "At least one feature is required.",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = moongose.model("SubCategory", subCategorySchema);
