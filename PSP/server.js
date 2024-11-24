const express = require("express");
const dotenv = require("dotenv");
const net = require("net");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { server_start } = require("./utils/colorText");
const corsOptions = require("./config/corsOptions");

dotenv.config();

const app = express();

// Loaders e.g. mongoose...
require("./loaders/db");
// End loaders

//OVDE IDU MIDDLEWARE

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// **** Routes ****
const routes = {
  merchant: require("./components/merchant/merchant.routes"),
  transaction: require("./components/transaction/transaction.routes"),
  // payment: require("./components/payment/payment.routes"),
};

routes.merchant(app);
routes.transaction(app);
//   routes.payment(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const portInUse = (port, callback) => {
  const server = net.createServer((socket) => {
    socket.write("Echo server\r\n");
    socket.pipe(socket);
  });
  server.on("error", () => {
    callback(true);
  });
  server.on("listening", () => {
    server.close();
    callback(false);
  });
  server.listen(port, "127.0.0.1");
};

const port = process.env.PORT || 8082;

portInUse(port, (isPortInUse) => {
  if (!isPortInUse) {
    app.listen(port, () => {
      console.log(server_start("Node app is running on port", port));
    });
  } else {
    console.log(server_start("Node app is running on port", port));
  }
});

module.exports = app;
