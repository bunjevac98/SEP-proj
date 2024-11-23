const controller = require("../user/user.controller"); // Import the user controller module

module.exports = (app) => {
  //jwt.checkToken, checkCreate.handle(),
  app.route("/create-user").post(controller.create);
  //jwt.checkToken, checkgetAll.handle(),
  app.route("/users-get-all").get(controller.getAll);
  //jwt.checkToken, checkGetByID.handle(),
  app.route("/get-user/:id").get(controller.getById);
  //jwt.checkToken, checkUpdate.handle(),
  app.route("/users/update-employee/:id").put(controller.update);
  //jwt.checkToken, checkDelete.handle(),
  app.route("/users/delete-employee/:id").post(controller.delete);
};
