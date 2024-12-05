const TransactionModel = require("../transaction/models/transaction.models");
const Merchant = require("../merchant/models/merchant.models");
const PaymentModel = require("./models/payment.model");

module.exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !data.name || !data.status) {
      return res.status(400).json({ message: "Bad request" });
    }
    data.name = data.name.toLowerCase();

    const paymentMethod = await PaymentModel.findOne({ name: data.name });

    if (paymentMethod) {
      return res.status(404).json({ message: "We have this payment method" });
    }
    const payment = new PaymentModel(data);

    await payment.save();

    return res
      .status(200)
      .json({ message: "PaymentMethod created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update a transaction
 * @param {ObjectId} req.params.id - transaction id
 * @param {Object} req.body - transaction data
 * @return {Promise<Transaction, Error>}
 */
module.exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await PaymentModel.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.status(200).json({ data: payment });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.updateStatusOfPaymentmethods = async (req, res) => {
  try {
    const id = req.params.id;
    const payment = await PaymentModel.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    const allPaymentMethods = await PaymentModel.find();
    // Proveri da li su svi payment methods "inactive"
    const allInactive = allPaymentMethods.every(
      (paymentMethod) => paymentMethod.status === "inactive"
    );

    if (allInactive) {
      return res
        .status(400)
        .json({ message: "All payment methods cannot be inactive." });
    }

    if (!["inactive", "active"].includes(req.body.status)) {
      return res.status(400).json({ message: "Bad request" });
    }
    payment.status = req.body.status;
    await payment.save();
    return res.status(200).json({ data: payment });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getAllPayerMethods = async (req, res) => {
  try {
    const data = await PaymentModel.find();
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
