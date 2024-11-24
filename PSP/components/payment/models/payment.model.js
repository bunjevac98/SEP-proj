const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  paymentType: { type: String, required: true },
  // merchant: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant" },
  // merchantPassword: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" }, // Status metode (aktivna ili neaktivna)
  supportedCurrencies: [String],
  paymentUrl: { type: String },
  // transactionFee: { type: Number },
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
