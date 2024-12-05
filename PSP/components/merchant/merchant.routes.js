const controller = require("../merchant/merchant.controller"); // Import the user controller module

module.exports = (app) => {
  app.route("/create-merchant").post(controller.create);

  app
    .route("/get-all-available-payment-methods-from-merchant/:id")
    .get(controller.getAllPaymentMethodsByMerchant);

  app
    .route("/update-merchant-payment-methods/:id")
    .put(controller.updateMerchantPaymentMethods);

  app.route("/get-all-merchants").get(controller.getAll);
};
