const categoryController = require("./categories.controller");
const jwtMiddleware = require("../../middleware/jwt");

module.exports = (app) => {
  app.route("/create-category").post(categoryController.create);

  app.route("/categories-get-all").get(categoryController.getAll);
  
  app.route("/get-category-description/:id").get(categoryController.getCategoryDescription);

  app.route("/categories-get-all-by-url").get(categoryController.getAllByUrl);
  app
    .route("/categories-get-product-from-categorty/:id/:page/:limit")
    .get(categoryController.getAllProductFromCategory);

  app.route("/update-category/:id").put(categoryController.update);

  app.route("/delete-category/:id").delete(categoryController.delete);

};
