const controller = require("../bankMerchants/bankMerchant.controller"); // Import the user controller module

module.exports = (app) => {
  app.route("/create-merchant").post(controller.create);
  
  // app.route("/get-all-available-payment-methods").get(controller.getAll);
};
