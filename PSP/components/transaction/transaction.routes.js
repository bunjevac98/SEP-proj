const controller = require("./transaction.controller");

module.exports = (app) => {
  app.route("/initiate-transaction").post(controller.initiateTransaction);

  app
    .route("/update-transaction-payment-method/:id")
    .put(controller.updateTransaction);
};
