//const controller = require("./orders.controller");
const controller = require("./orders.controller");
const jwt = require("../../middleware/jwt");
// const checkUpdate = require("../../middleware/orders/updateMiddleware");
// const checkDelete = require("../../middleware/orders/deleteMiddleware");

module.exports = (app) => {
  //Creating Order and afther order create Shipment
  app.route("/create-order/").post(controller.create);
  //Get all orders that user have
  app.route("/get-all-orders/").get(controller.getAll);
  //Get order details
  app.route("/order-details/:id/").get(controller.orderDetails);

  app.route("/get-user-orders/:id").get(controller.getOrdersByUser);

  app.route("/update-order-status/:id").put(controller.changeOrderStatus);
  
  //Delete order
  /**
   * @param {function} jwt.checkToken - Middleware to check JWT token
   * @param {function} checkDelete.handle - Middleware to handle order deletion */
  app.route("/delete-order/:id").delete(controller.deleteOrder);
};
