const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    merchantId: { type: String, required: true }, // ID prodavca
    merchantOrderId: { type: String, required: true, unique: true }, // Jedinstveni ID transakcije
    amount: { type: Number, required: true }, // Iznos transakcije
    currency: { type: String, required: true, default: 'USD' }, // Valuta
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' }, // Status transakcije
    paymentMethod: { type: String, required: true }, // Metoda plaćanja
    timestamp: { type: Date, default: Date.now }, // Vreme transakcije
    response: { type: Object, default: null }, // Odgovor od banke/PSP-a
});

module.exports = mongoose.model('Transaction', transactionSchema);