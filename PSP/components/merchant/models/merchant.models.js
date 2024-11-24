const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  merchantId: { type: String, required: true, unique: true },
  merchantName: { type: String, required: true },
  merchantPassword: { type: String, required: true },
  merchantEmail: { type: String, required: true, unique: true },
  paymentMethods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' }],
  allowedPaymentMethods: {
    type: [String],
    enum: ["QR", "PayPal", "Crypto", "Bank"], // Definisanje dozvoljenih metoda
    default: ["Bank"], // Po defaultu može biti Bank, ali može biti bilo koja od ponuđenih opcija
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Merchant", merchantSchema);
