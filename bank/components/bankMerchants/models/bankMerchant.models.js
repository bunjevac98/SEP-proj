const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  merchantId: { type: String, unique: true, required: true, unique: true },
  merchantPassword: { type: String, required: true },
  merchantName: { type: String, required: true },
  merchantEmail: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  merchantCard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankCard",
    required: false,
  },
});

module.exports = mongoose.model("BankMerchant", merchantSchema);
