const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      match: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Color", ColorSchema);
