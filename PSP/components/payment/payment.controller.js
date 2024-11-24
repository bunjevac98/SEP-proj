const Transaction = require("./models/transaction.models");
const Merchant = require("../merchant/models/merchant.models");
const PaymentMethod = require("../payment/models/payment.model");

module.exports.create = async (req, res) => {};

/**
 * Update a transaction
 * @param {ObjectId} req.params.id - transaction id
 * @param {Object} req.body - transaction data
 * @return {Promise<Transaction, Error>}
 */
module.exports.getById = async (req, res) => {};
