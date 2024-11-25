const Merchant = require("../models/bankMerchant.models");

module.exports.checkMerchan = async (merchantId) => {
  try {
    const merchant = await Merchant.findOne({ merchantId });
    if (!merchant) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking merchant:", error);
    return false;
  }
};
