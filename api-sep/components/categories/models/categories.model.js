const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, trim: true },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    url: { type: String, required: false, unique: true },
    description: { type: String, required: false },
    metaDesc: { type: String },
    metaTitle: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
