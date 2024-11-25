const BankTransaction = require("./models/bankTransactions.models");
const BankMerchant = require("../bankMerchants/models/bankMerchant.models");
const crypto = require("crypto");

module.exports.createPaymentUrl = async (req, res) => {
  try {
    const body = req.body;

    const { merchant, vlidation } = await validateBody(body);
    console.log(vlidation);
    if (!vlidation) {
      return res.status(400).json({ message: "Bad request" });
    }

    const paymentUrl = "OVO TREBA DODATI";
    const paymentId = generatePaymentId();

    const bankTransaction = new BankTransaction({
      bankPaymentId: paymentId,
      bankMerchantId: merchant._id,
      bankAmount: body.AMOUNT,
      bankOrderId: body.MERCHANT_ORDER_ID,
      bankTimestamp: body.MERCHANT_TIMESTAMP,
      bankStatus: "pending", // Initial status
      success_url: body.SUCCESS_URL,
      failde_url: body.FAILED_URL,
      error_url: body.ERROR_URL,
    });

    const bank = await bankTransaction.save();

    return res.status(200).json({ paymentId, paymentUrl });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const validateBody = async (body) => {
  console.log(body);
  const {
    MERCHANT_ID,
    MERCHANT_PASSWORD,
    AMOUNT,
    MERCHANT_ORDER_ID,
    MERCHANT_TIMESTAMP,
    SUCCESS_URL,
    FAILED_URL,
    ERROR_URL,
  } = body;
  if (
    !MERCHANT_ID ||
    !MERCHANT_PASSWORD ||
    !AMOUNT ||
    !MERCHANT_ORDER_ID ||
    !MERCHANT_TIMESTAMP ||
    !SUCCESS_URL ||
    !FAILED_URL ||
    !ERROR_URL
  ) {
    return false;
  }

  const merchant = await BankMerchant.findOne({ merchantId: MERCHANT_ID });

  if (!merchant) {
    return false;
  }

  if (merchant.merchantPassword !== MERCHANT_PASSWORD) {
    return false;
  }
  return { merchant, vlidation: true };
};

const generatePaymentId = () => {
  // Generate a random string for added uniqueness
  const randomPart = crypto.randomBytes(8).toString("hex");
  // Include a timestamp to ensure chronological uniqueness
  const timestampPart = Date.now().toString();

  // Combine both parts
  return `PAY-${timestampPart}-${randomPart}`;
};
