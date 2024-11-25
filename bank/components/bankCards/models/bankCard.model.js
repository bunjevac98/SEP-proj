const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bankCardSchema = new mongoose.Schema({
  bankPan: {
    type: String,
    required: true,
    unique: true,
  },
  bankBalance: {
    type: Number,
    required: true,
  },
  bankCvv: {
    type: String,
    required: true,
  },
  bankExpiryDate: {
    type: String, // Može biti u formatu "MM/YY"
    required: true,
  },
  bankCardHolderName: {
    type: String,
    required: true,
  },
  bankIssuer: {
    type: String, // Ime banke koja je izdala karticu
    required: true,
  },
});

const BankCard = mongoose.model("BankCard", bankCardSchema);

module.exports = BankCard;
