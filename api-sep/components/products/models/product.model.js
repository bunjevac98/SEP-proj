const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sizeSchema = new Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
});

const dataSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    numOfArticle: { type: String, unique: true },
    price: { type: Number, required: false, default: 0 },
    description: { type: String, required: false },
    format: { type: String, required: true },
    url: { type: String, required: true },
    featureImage: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    quantity: { type: Number, required: false, default: 0 },
    isPopular: { type: Boolean, default: false },
    status: {
      type: String,
      required: true,
      default: "Available",
      enum: ["Available", "Unavailable"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      default: null,
    },
    hasSizes: { type: Boolean, default: false }, // Flag to indicate if the product has sizes
    sizes: [
      {
        type: sizeSchema,
        required: function () {
          return this.hasSizes;
        }, // Only required if `hasSizes` is true
      },
    ],
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", dataSchema);
