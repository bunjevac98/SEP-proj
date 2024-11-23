const controller = require("../auth/auth.controller");
// const checkRegister = require('../../middleware/authentication/registerMiddleware.js');
// const checkLogin = require('../../middleware/authentication/loginMiddleware.js');

module.exports = (app) => {
  //checkLogin.handle(),sdasdasad
  app.route("/login").post(controller.login);
  //checkRegister.handle(),
  app.route("/register").post(controller.register);

  app.route("/email-verification/:token").get(controller.verifyEmail);

  //   app.route("/forgot-password").post(controller.forgotPassword);

  //   app.route("/password-reset/:token").post(controller.resetPassword);
};
