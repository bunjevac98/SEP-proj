const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    type: { type: String }, // resource type e.g. data, category, post...
    imageType: { type: String }, // e.g. feature, galery, front, back image...
    localPath: { type: String },
    url: { type: String },
    type: { type: String }, //is it image to listings or smth other
    bucket: { type: String },
    key: { type: String },
    originalname: { type: String },
    forMobile: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    altTitle: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
