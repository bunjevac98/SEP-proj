const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },
  orderNumber: { type: String },
  address: { type: String, required: true, default: "" },
  totalPrice: { type: String },
  status: {
    type: String,
    enum: ["Canceled", "Delivered", "On Delivery", "Ordered", "In Progress"],
    default: "Ordered",
  },
  orderedProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true, default: 0 },
      size: { type: String, require: false },
      price: { type: Number, require: false },
    },
  ],
  description: { type: String, required: false },
  customer: {
    type: Object,
    required: false,
    properties: {
      email: {
        type: String,
        required: function () {
          return this.customer !== undefined;
        },
      },
      firstName: {
        type: String,
        required: function () {
          return this.customer !== undefined;
        },
      },
      lastName: {
        type: String,
        required: function () {
          return this.customer !== undefined;
        },
      },
      address: {
        type: String,
        required: function () {
          return this.customer !== undefined;
        },
      },
      companyName: {
        type: String,
        required: false,
        default: "",
      },
      phone: {
        type: [String], // Define phoneNumber as an array of strings
        required: function () {
          return this.customer !== undefined; // The field is required if customer is defined
        },
      },
      PIB: {
        type: String,
        required: false,
        default: "",
      },
    },
  },
});

module.exports = mongoose.model("Orders", ordersSchema);
