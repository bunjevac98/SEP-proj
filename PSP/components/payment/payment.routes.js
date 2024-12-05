const controller = require("./payment.controller");

module.exports = (app) => {
  app.route("/payment-methods").post(controller.create);

  app.route("/payment-methods/:id").get(controller.getById);

  app.route("/payment-methods").get(controller.getAllPayerMethods);

  app
    .route("/payment-methods/:id")
    .put(controller.updateStatusOfPaymentmethods);
};
