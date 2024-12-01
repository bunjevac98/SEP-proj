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
    required: false,
  },
  bankIssuer: {
    type: String, // Ime banke koja je izdala karticu
    required: false,
  },
});

const BankCard = mongoose.model("BankCard", bankCardSchema);

module.exports = BankCard;
