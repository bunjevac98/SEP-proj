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
app.use(fileUpload());
//

// **** Routes ****
const routes = {
  users: require("./components/user/user.routes"),
  auth: require("./components/auth/auth.routes"),
  category: require("./components/categories/categories.routes"),
  // //uploadLocal: require('./components/upload-local/upload-local.routes'),
  // images: require('./components/images/image.routes'),
  products: require("./components/products/product.routes"),
  orders: require("./components/orders/orders.routes"),
};

routes.auth(app);
routes.users(app);
routes.category(app);
// routes.uploadLocal(app);
// routes.images(app)
routes.products(app);
routes.orders(app);

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

const port = process.env.PORT || 8081;

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
