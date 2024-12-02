const controller = require("./bankCard.controller");

module.exports = (app) => {
  app.route("/payment-process/:id").post(controller.paymentProcess);

  app.route("/get-bank-card/:id").get(controller.getBankCardById);

  app.route("/create-bank-card").post(controller.createBankCard);
};
