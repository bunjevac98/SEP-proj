const controller = require("./product.controller");
const jwt = require("../../middleware/jwt");
const { checkRole } = require("../../middleware/products/createMiddleware");
module.exports = (app) => {
  app
    .route("/create-product")
    .post(jwt.checkToken, checkRole("admin"), controller.create);

  app.route("/get-all-product").get(controller.getAllProducts);

  app.route("/get-all-popular-products").get(controller.getAllPopularProducts);

  app
    .route("/product/:id")
    .get(controller.getById)
    .put(jwt.checkToken, checkRole("admin"), controller.updateProduct); ///update product za frontend
  app
    .route("/delete-product/:id")
    .delete(jwt.checkToken, checkRole("admin"), controller.deleteProduct);

  app.route("/search-product").post(controller.searchProduct);
};
