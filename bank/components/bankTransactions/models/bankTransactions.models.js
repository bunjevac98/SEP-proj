const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankTransactionSchema = new mongoose.Schema({
  bankPaymentId: {
    type: String,
    required: true,
    unique: true,
  },
  bankMerchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BankMerchant",
    required: true,
  },
  bankAmount: {
    type: Number,
    required: true,
  },
  bankOrderId: {
    type: String,
    required: true,
  },
  bankTimestamp: {
    type: Date,
    default: Date.now,
  },
  bankStatus: {
    type: String,
    enum: ["pending", "reserved", "completed", "failed"],
    default: "pending",
  },
  bankSuccessUrl: {
    type: String,
  },
  bankFailedUrl: {
    type: String,
  },
  bankErrorUrl: {
    type: String,
  },
});

module.exports = mongoose.model("BankTransaction", bankTransactionSchema);
