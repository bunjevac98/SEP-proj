const Order = require("./models/orders.model");
const Product = require("../products/models/product.model");
const User = require("../user/models/user.model");
const { shopEmailsHandler } = require("../../emailHandler/orderEmailHandler");
const axios = require("axios");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//Generise nasumican broj ordera
const generateOrderNumber = async () => {
  let exists = true;
  let orderNumber;

  while (exists !== false) {
    orderNumber = Math.random().toString().substr(2, 6);
    let checkNum = await Order.findOne({ orderNumber: orderNumber });

    if (!checkNum) {
      exists = false;
    }
  }
  return orderNumber;
};

const getProductsOfOrder = async (order) => {
  try {
    let totalPrice = 0;
    let products = [];

    if (order && order.orderedProducts) {
      for (const product of order.orderedProducts) {
        const foundProd = await Product.findById(product.productId);
        if (!foundProd) {
          return { message: "No product found!" };
        }

        let productPrice = foundProd.price; // Default na osnovnu cenu proizvoda
        let selectedSize = null;

        // Ako proizvod ima veličine, tražimo odgovarajuću veličinu
        if (foundProd.sizes && foundProd.sizes.length > 0 && product.size) {
          selectedSize = foundProd.sizes.find((s) => s.size === product.size);
          if (!selectedSize) {
            return {
              message: `Size ${product.size} not found for product ${foundProd.title}`,
            };
          }
          productPrice = selectedSize.price; // Koristimo cenu za određenu veličinu
        }

        // Dodaj cenu na osnovu količine
        totalPrice += productPrice * product.quantity;
        console.log("selectedSize--->", selectedSize);
        // Dodaj proizvod u listu naručenih proizvoda
        products.push({
          productId: product.productId,
          size: selectedSize ? product.size : null, // Ako nema veličine, ostavi null
          quantity: product.quantity,
          price: productPrice, // Koristi odgovarajuću cenu
        });
      }
      return { products, totalPrice };
    }
    return { message: "No order found" };
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.create = async (req, res) => {
  try {
    let data = req.body;

    //#region Provera da li je korisnik ulogovan i da li su svi proizvodi dostupni
    //Provera da li je to ulogovani korisnik
    if (!req.body.customer_id || req.body.customer_id === "") {
      customer_id = null;
    }

    //Proveravamo da li su svi aktivni Proizvodi
    for (let i = 0; i < data.orderedProducts.length; i++) {
      const prod = await Product.findById({
        _id: data.orderedProducts[i].productId,
      });
      if (prod.status !== "Available") {
        return res.status(400).json({
          message: "Neki proizvod iz korpe trenutno nemamo na stanju",
        });
      }
    }
    //#endregion

    let totalPrice = 0;

    let orderObj = {};

    //Unique number of order
    const orderNumber = await generateOrderNumber();

    //Product of cart
    const productsOfOrder = await getProductsOfOrder(data);
    console.log("productsOfOrder---------------->", productsOfOrder);
    //Total price of order
    totalPrice =
      productsOfOrder && productsOfOrder.totalPrice
        ? productsOfOrder.totalPrice
        : 0;

    console.log("totalPrice", totalPrice);

    if (totalPrice < 2000) {
      return res
        .status(400)
        .json({ message: "Minimalna cena za narucivanje je 2000 din." });
    }
    // Ako korisnik nije ulogovan

    //Ovde treba da se hendluje adresa korisnika
    const user = await User.findById(req.body.customer_id);

    let address_for_order = user.address;

    // Create the order //we can add aditional conditions to se is therreq.bodz salesman id or customer id or whathever nevermind

    orderObj.customer_id = req.body.customer_id;
    orderObj.orderNumber = orderNumber;
    orderObj.address = address_for_order;
    orderObj.totalPrice = totalPrice;
    orderObj.status = "In Progress";
    orderObj.orderedProducts = productsOfOrder.products;
    orderObj.description = req.body.description || "";

    //Save the order to the database
    let buyer = user;

    const order = new Order(orderObj);
    await order.save();

    //TODO: OVO TREBA DA SE POZOVE FUNKCIJA KOJA CE SE POZVEZATI SA PSP i salje odredjene informacije
    console.log("Stigli smo do order od WEBSHOPA");
    const requestBody = {
      MERCHANT_ID: process.env.MERCHANT_ID,
      MERCHANT_PASSWORD: process.env.MERCHANT_PASSWORD,
      AMOUNT: parseInt(order.totalPrice),
      MERCAHNT_ORDER_ID: orderNumber,
      MERCHANT_TIMESTAMP: new Date().toISOString(),
      PAYMENT_METHOD: "bank",
      //Ovo se postavlja kod PSP-a
      // SUCCESS_URL: successUrl,
      // FAILED_URL: failedUrl,
      // ERROR_URL: errorUrl,
    };

    try {
      const response = await axios.post(
        "http://localhost:3339/create-transaction", // Dodaj http://
        requestBody
      );

      console.log("Zavrsili smo order od WEBSHOPA", response.data);

      return response.data; // Sadrži PAYMENT_URL i PAYMENT_ID
    } catch (error) {
      throw new Error(`Failed to send request to PSP: ${error.message}`);
    }

    return res.status(201).json({ order });
  } catch (error) {
    console.log("Create Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

const notLoginUser = async (
  customer,
  orderNumber,
  productsOfOrder,
  totalPrice,
  description
) => {
  try {
    let orderObj = {};

    orderObj.orderNumber = orderNumber;
    orderObj.address = customer.address;
    orderObj.totalPrice = totalPrice;
    orderObj.status = "Ordered";
    orderObj.orderedProducts = productsOfOrder.products;
    orderObj.description = description;
    orderObj.customer = customer;

    //Save the order to the database
    const order = new Order(orderObj);
    await order.save();

    console.log("customer.email-->", customer.email);

    await shopEmailsHandler(
      order.orderedProducts,
      customer,
      orderNumber,
      customer.address,
      customer.email,
      order.description || "--",
      "bought"
    );

    await shopEmailsHandler(
      order.orderedProducts,
      customer,
      orderNumber,
      customer.address,
      "stopak.ambalaza@gmail.com", //"vukanstokuca99@gmail.com", //"caxapex271@ndiety.com"
      order.description || "--",
      "sold"
    );
    return true;
  } catch (error) {
    console.log("CATCHERR", error);
    return false;
  }
};

const fetchProductsForMail = async (productsOfOrder) => {
  try {
    console.log("productsOfOrder", productsOfOrder);

    // Initialize an array to store product IDs
    const productIds = [];

    // Extract product IDs using a for loop
    for (const product of productsOfOrder.products) {
      productIds.push(product.productId);
    }
    console.log("productIds", productIds);

    // Fetch all products using the array of product IDs
    const products = await Product.find({ _id: { $in: productIds } })
      .populate("createdBy")
      .exec();
    console.log("products", products);

    if (products.length !== productIds.length) {
      console.log("Not all products were found.");
    }

    return products;
  } catch (error) {
    console.error("Error fetching products", error);
  }
};

exports.getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const allOrders = await Order.find().populate("customer_id");

    if (allOrders.length < 1) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijednu posiljku" });
    }

    const paginatedData = allOrders.slice(
      (pageNumber - 1) * limit,
      pageNumber * limit
    );

    const totalItems = allOrders.length;

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      paginatedData,
      totalCount: totalItems,
      pagesCount: totalPages,
    });
  } catch (error) {
    console.log("CATCHERR", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.orderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("customer_id")
      .populate({
        path: "orderedProducts.productId",
        populate: {
          path: "featureImage", // Popunjavaš featureImage koji je ObjectId
        },
      });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).json({ message: "Bad request of order Id" });
    }

    const orderToChange = await Order.findByIdAndUpdate(orderId, {
      status: "Delivered",
    });

    if (!orderToChange) {
      return res
        .status(404)
        .json({ message: "Nismo uspeli da updejtujemo order!" });
    }

    return res
      .status(200)
      .json({ message: `Uspesno smo updejtovali order`, orderToChange });
  } catch (error) {
    console.log("CATCHERR", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const userId = req.params.id;

    const orders = await Order.find({ customer_id: userId }).populate(
      "orderedProducts.productId"
    );

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijednu vasu narudzbinu" });
    }
    const paginatedData = orders.slice(
      (pageNumber - 1) * limit,
      pageNumber * limit
    );

    const totalItems = orders.length;

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({ paginatedData, totalItems, totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Niste dobro prosledili parametre" });
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(400).json({ message: "Niste obrisali narudzbinu" });
    }

    return res
      .status(200)
      .json({ message: "Uspesno ste obrisali narudzbinu", deletedOrder });
  } catch (error) {
    return res.status(500).json({ message: `Internal server error:${error}` });
  }
};
