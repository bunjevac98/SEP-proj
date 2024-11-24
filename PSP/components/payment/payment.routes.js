const controller = require("./transaction.controller");

module.exports = (app) => {
  app.route("/payment-methods").post(controller.create);

  app.route("/payment-methods/:id").get(controller.getById);
};
