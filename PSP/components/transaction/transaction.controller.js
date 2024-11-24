const Transaction = require("./models/transaction.models");

module.exports.createTransaction = async (req, res) => {
  try {
    const { MERCHANT_ID, MERCAHNT_ORDER_ID, AMOUNT, PAYMENT_METHOD } = req.body;
    console.log(req.body);
    // Validation
    if (!MERCHANT_ID || !MERCAHNT_ORDER_ID || !AMOUNT || !PAYMENT_METHOD) {
      return res.status(400).json({ message: "Bad request" });
    }

    // Check if the merchant exists
    const merchant = await Merchant.findById(MERCHANT_ID);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    // Create a new transaction
    const transaction = new Transaction({
      merchantId: MERCHANT_ID._id,
      MERCAHNT_ORDER_ID,
      AMOUNT,
      PAYMENT_METHOD,
      successUrl: "https://yourdomain.com/success",
      failedUrl: "https://yourdomain.com/failed",
      errorUrl: "https://yourdomain.com/error",
    });

    await transaction.save();

    // Call the relevant payment service (e.g., Bank, PayPal)
    const paymentService = getPaymentService(paymentMethod); // Dynamic method selection
    const paymentUrl = await paymentService.initiateTransaction(transaction);

    res.status(201).json(transaction);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

function getPaymentService(paymentMethod) {
  const service = paymentServices[paymentMethod.toLowerCase()];
  if (!service) {
    throw new Error(`Payment method ${paymentMethod} is not supported.`);
  }
  return service;
}
