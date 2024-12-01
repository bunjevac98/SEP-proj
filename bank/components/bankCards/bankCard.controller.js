const mongoose = require("mongoose");
const BankCard = require("./models/bankCard.model");
const BankTransaction = require("../bankTransactions/models/bankTransactions.models");
const BankMerchant = require("../bankMerchants/models/bankMerchant.models");

module.exports.paymentProcess = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const paymentId = req.params.id;
    console.log(paymentId);
    const {
      bankPan,
      amount,
      bankCvv,
      bankExpiryDate,
      bankCardHolderName,
      bankIssuer,
    } = req.body;

    if (!bankPan || !amount || !bankCvv || !bankExpiryDate) {
      throw new Error("Missing required fields");
    }
    // Ažuriraj saldo kupca
    const buyerResult = await updateBuyerBalance(
      bankPan,
      bankCvv,
      bankExpiryDate,
      amount
    );
    if (!buyerResult.success) {
      throw new Error(buyerResult.message);
    }

    // Ažuriraj status transakcije
    const transactionResult = await updateTransactionStatus(
      paymentId,
      "success"
    );
    if (!transactionResult.success) {
      throw new Error(transactionResult.message);
    }

    // Ažuriraj saldo trgovca
    const merchantResult = await updateMerchnatBalance(
      transactionResult.transaction.bankMerchantId,
      amount
    );
    if (!merchantResult.success) {
      throw new Error(merchantResult.message);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).send({ message: "Payment processed successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error in payment process:", error.message);
    return res.status(400).send({ message: error.message });
  }
};

async function updateBuyerBalance(bankPan, bankCvv, bankExpiryDate, amount) {
  const buyerCard = await BankCard.findOne({
    bankPan: bankPan,
    bankCvv: bankCvv,
    bankExpiryDate: bankExpiryDate,
  });

  if (!buyerCard) {
    return { success: false, message: "Buyer not found" };
  }
  //Obratiti paznju koji URL Vraca FAIL
  if (buyerCard.bankBalance < amount) {
    return {
      success: false,
      message: "Buyer does not have enough money in balance",
    };
  }

  buyerCard.bankBalance -= amount;

  await buyerCard.save();
  return { success: true };
}
async function updateTransactionStatus(paymentId, status) {
  const transaction = await BankTransaction.findOne({
    bankPaymentId: paymentId,
  });
  console.log(transaction);
  if (!transaction) {
    return { success: false, message: "Transaction not found" };
  }
  transaction.bankStatus = status;
  await transaction.save();
  return { success: true, transaction };
}
async function updateMerchnatBalance(merchantId, amount) {
  const merchant = await BankMerchant.findById(merchantId);
  if (!merchant) {
    return { success: false, message: "Merchant not found" };
  }
  merchant.bankBalance += amount;
  await merchant.save();
  return { success: true };
}

/**
 * Retrieves a bank card by its id
 * @param {string} id - The id of the bank card
 * @returns {BankCard} - The bank card with the given id
 */
module.exports.getBankCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const bankCard = await BankCard.findById(id);
    if (!bankCard) {
      return res.status(404).send({ message: "Bank card not found" });
    }
    res.status(200).send(bankCard);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error getting bank card" });
  }
};
module.exports.createBankCard = async (req, res) => {
  try {
    const data = req.body;
    const validate = await validateCardData(data);
    if (!validate) {
      return res.status(400).send({ message: "Bad request" });
    }

    const newBankCard = new BankCard(data);

    await newBankCard.save();
    return res.status(200).send({ message: "Bank card created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Error creating bank card" });
  }
};

async function validateCardData(data) {
  if (
    !data ||
    !data.bankPan ||
    !data.bankBalance ||
    !data.bankCvv ||
    !data.bankExpiryDate ||
    !data.bankCardHolderName ||
    !data.bankIssuer
  ) {
    throw new Error("Bad request");
  }
  const exists = await BankCard.findOne({ bankPan: data.bankPan });
  if (exists) {
    throw new Error("Bank card already exists");
  }
  return true;
}
