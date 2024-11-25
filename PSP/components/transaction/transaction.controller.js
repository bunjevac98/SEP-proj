const Transaction = require("./models/transaction.models");
const Merchant = require("../merchant/models/merchant.models");
const { bankService } = require("../../services/bankService");
const axios = require("axios");

module.exports.initiateTransaction = async (req, res) => {
  try {
    const {
      MERCHANT_ID,
      MERCAHNT_ORDER_ID,
      AMOUNT,
      SUCCESS_URL,
      FAILED_URL,
      ERROR_URL,
    } = req.body;

    console.log("req.body", req.body);
    // Validation
    if (
      !MERCHANT_ID ||
      !MERCAHNT_ORDER_ID ||
      !AMOUNT ||
      !SUCCESS_URL ||
      !FAILED_URL ||
      !ERROR_URL
    ) {
      return res.status(400).json({ message: "Bad request" });
    }

    // Check if the merchant exists
    const merchant = await Merchant.findOne({ merchantId: MERCHANT_ID });

    console.log("REQ.BODY", req.body);
    console.log("merchant", merchant);

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    // Create a new transaction
    const transaction = new Transaction({
      merchantId: merchant._id,
      amount: AMOUNT,
      orderId: MERCAHNT_ORDER_ID,
      successUrl: SUCCESS_URL,
      failedUrl: FAILED_URL,
      errorUrl: ERROR_URL,
    });

    const savedTransaction = await transaction.save();
    const transactionData = savedTransaction._id;
    console.log("savedTransaction", savedTransaction._id);

    // Call the relevant payment service (e.g., Bank, PayPal)
    const paymentService = merchant.allowedPaymentMethods; // Dynamic method selection

    console.log("paymentService", paymentService);

    return res.status(201).json({ paymentService, transactionData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
// const paymentUrl = await paymentService.initiateTransaction(transaction);

module.exports.updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { paymentMethod } = req.body;

    // Proveri da li postoji transakcija
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Proveri da li je metoda plaćanja podržana od strane merchant-a
    const merchant = await Merchant.findById(transaction.merchantId);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    if (!merchant.allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Payment method not allowed" });
    }
    console.log(merchant);
    // Ažuriraj paymentMethod, paymentId i paymentUrl u transakciji
    if (paymentMethod === "Bank") {
      const bankRequestData = {
        merchantId: merchant.merchantId, // ID za banku (čuvaš ga za svakog merchant-a)
        merchantPassword: merchant.merchantPassword, // API ključ ili lozinka
        amount: transaction.amount,
        merchantOrderId: transaction.orderId,
        timestamp: new Date().toISOString(),
        successUrl: transaction.successUrl,
        failedUrl: transaction.failedUrl,
        errorUrl: transaction.errorUrl,
      };

      // Očekuje se da `bankService.initiateTransaction` šalje zahtev banci
      const bankResponse = await bankService.initiateTransaction(
        bankRequestData
      );
      console.log("bankResponse");
      // Preuzmi PAYMENT_ID i PAYMENT_URL iz odgovora banke
      const paymentId = bankResponse.paymentId;
      const paymentUrl = bankResponse.paymentUrl;

      //TODO: hendlovati gresku ako nema paymentURL verovatno baciti error url

      // Ažuriraj transakciju sa novim podacima
      transaction.paymentMethod = paymentMethod;
      transaction.paymentId = paymentId;
      transaction.paymentUrl = paymentUrl;

      console.log("transac21323tion", transaction);
      await transaction.save();

      // Redirektuj korisnika na banku
      return res.status(302).redirect(`${paymentUrl}/${paymentId}`);
    }

    // Ako metoda plaćanja nije banka
    return res.status(400).json({ message: "Unsupported payment method" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// paypalService.js
module.exports.initiateTransaction = async (transaction) => {
  // Implementirajte logiku za komunikaciju sa PayPal-om
  const paymentUrl = "https://paypal.com/transaction";
  return paymentUrl;
};
// bankService.js
module.exports.initiateTransaction = async (transaction) => {
  // Implementirajte logiku za komunikaciju sa bankom
  const paymentUrl = "https://bank.com/transaction";
  return paymentUrl;
};
