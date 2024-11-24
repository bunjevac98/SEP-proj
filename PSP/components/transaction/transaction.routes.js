const controller = require("./transaction.controller");

module.exports = (app) => {

    app.route("/create-transaction").post(controller.createTransaction);

};
