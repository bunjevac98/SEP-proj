const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true }, // e.g., 'PayPal', 'Crypto', 'Bank'
    transactionStatus: { type: String, default: 'pending' }, // 'pending', 'approved', 'failed'
    paymentUrl: { type: String }, // URL for completing the payment
    responseCode: { type: String }, // Response from the payment gateway (e.g., 200, 400)
    successUrl: { type: String }, // URL to redirect user if payment is successful
    failedUrl: { type: String }, // URL to redirect user if payment fails
    errorUrl: { type: String }, // URL to redirect if error occurs
  });

module.exports = mongoose.model('Transaction', transactionSchema);