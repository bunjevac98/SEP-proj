const controller = require("./bankTransactions.controller");

module.exports = (app) => {
  app.route("/create-payment-url").post(controller.createPaymentUrl);
};
