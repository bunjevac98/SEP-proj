const axios = require("axios");

const bankService = {
  initiateTransaction: async (data) => {
    try {
      // Priprema podataka za zahtev
      const payload = {
        MERCHANT_ID: data.merchantId,
        MERCHANT_PASSWORD: data.merchantPassword,
        AMOUNT: data.amount,
        MERCHANT_ORDER_ID: data.merchantOrderId,
        MERCHANT_TIMESTAMP: data.timestamp,
        SUCCESS_URL: data.successUrl,
        FAILED_URL: data.failedUrl,
        ERROR_URL: data.errorUrl,
      };

      // URL bankinog API-ja
      const bankApiUrl = "https://locallhost:3338/bank-api";

      // Slanje zahteva banci
      const response = await axios.post(bankApiUrl, payload);

      // Provera odgovora i vraćanje rezultata
      if (response.status === 200 && response.data) {
        return {
          paymentId: response.data.PAYMENT_ID, // Ekstrahovan PAYMENT_ID
          paymentUrl: response.data.PAYMENT_URL, // Ekstrahovan PAYMENT_URL
        };
      } else {
        throw new Error("Invalid response from bank");
      }
    } catch (error) {
      console.error("Error initiating transaction with bank:", error.message);
      throw new Error("Failed to initiate transaction with bank");
    }
  },
};

module.exports = bankService;