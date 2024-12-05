const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" }, // Status metode (aktivna ili neaktivna)
  supportedCurrencies: [String],
  paymentUrl: { type: String },
});

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
