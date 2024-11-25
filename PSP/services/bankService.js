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
      const bankApiUrl = "http://localhost:3338/create-payment-url";

      // Slanje zahteva banci
      const response = await axios.post(bankApiUrl, payload);

      console.log("response", response.data);
      // Provera odgovora i vraćanje rezultata
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response from bank");
      }
    } catch (error) {
      console.error("Error initiating transaction with bank:", error.message);
      throw new Error("Failed to initiate transaction with bank");
    }
  },
};

module.exports = { bankService };
