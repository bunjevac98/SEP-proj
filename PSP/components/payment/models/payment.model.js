const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Merchant', // Reference to the Merchant model
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true, // Ensure each order ID is unique
  },
  paymentMethod: {
    type: String,
    enum: ['bank', 'paypal', 'crypto'], // Supported payment methods
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01, // Minimum payment amount
  },
  currency: {
    type: String,
    default: 'USD', // Default currency
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'], // Transaction status
    default: 'PENDING',
  },
  transactionDetails: {
    paymentId: { type: String }, // Payment ID returned by external service
    timestamp: { type: Date }, // Timestamp when the payment was initiated
    successUrl: { type: String }, // URL to redirect on success
    failedUrl: { type: String }, // URL to redirect on failure
    errorUrl: { type: String }, // URL to redirect on error
    response: { type: Object }, // Store the response from the payment service
  },
  createdAt: {
    type: Date,
    default: Date.now, // Auto-set when the payment is created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Auto-update whenever the document changes
  },
});

paymentSchema.pre('save', function (next) {
  this.updatedAt = new Date(); // Update the timestamp before saving
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);