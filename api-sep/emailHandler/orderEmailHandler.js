const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Order = require("../components/orders/models/orders.model");

const emailTemplates = {
  bought: (
    productArray,
    orderNumber,
    buyer,
    address_for_order,
    description
  ) => {
    return `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Potvrda Pošiljke</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 70%;
                    margin: 0 auto;
                    border: 1px solid #ddd;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #000;
                    padding: 10px;
                    text-align: center;
                }
                .content {
                    margin-top: 20px;
                }
                .content p {
                    margin: 0 0 10px;
                }
                .table-container {
                    margin-top: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                .totals {
                    margin-top: 20px;
                }
                .header h1 {
                    color: #fff;
                }
                .totals td {
                    padding: 5px 10px;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                }
                .footer .logo {
                    margin-bottom: 10px; /* Dodajemo marginu ispod slike */
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                   
                    <h1>Hvala što kupujete kod nas!</h1>
                </div>
                <div class="content">
                    <p>Pozdrav!</p>
                    <p>Završili smo obradu vaše narudžbine.</p>
                    <p>Plati pouzećem.</p>
                    <p><strong>[Narudžbina ${orderNumber}] ${new Date().toLocaleDateString()}</strong></p>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Proizvod</th>
                                    <th>Količina</th>
                                    <th>Veličina</th>
                                    <th>Cena</th>
                                    <th>Ukupno bez PDV</th>
                                    <th>Ukupno</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${productArray.orderedProducts
                              .map(
                                (product) => `
                                <tr>
                                    <td>${product.productId.title}</td>
                                    <td>${product.quantity || 1}</td>
                                    <td>${
                                      product.size ? product.size : "-"
                                    }</td>
                                    <td>${product.price.toFixed(2)} rsd</td>
                                    <td>${(
                                      (product.quantity || 1) *
                                      product.price *
                                      0.8
                                    ) // Oduzimanje 20% poreza
                                      .toFixed(2)} rsd</td>
                                    <td>${(
                                      (product.quantity || 1) * product.price
                                    ).toFixed(2)} rsd</td>
                                </tr>
                                `
                              )
                              .join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="totals">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Metod plaćanja:</td>
                                    <td>Placanje pouzecem (Besplatna dostava na teritoriji Novog Sada i Vršca)</td>
                                </tr>
                                <tr>
                                    <td><strong>Ukupno:</strong></td>
                                    <td><strong>${
                                      productArray.totalPrice
                                    } rsd</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="address">
                        <p>${buyer.firstName ? buyer.firstName : ""} ${
      buyer.lastName ? buyer.lastName : ""
    } ${buyer.companyName ? buyer.companyName : ""}.
                        <br><strong>Adresa:</strong> ${address_for_order}<br>
                        <strong>Email:</strong> ${buyer.email}
                        <br>
                        <strong>Beleska:</strong> ${description}
                      </div>
                        <p>Hvala vam na kupovini u našoj prodavnici.</p>
                        <strong>Kontakt:</strong><br>
                        <strong>Telefon (Novi Sad):</strong> 069610199<br>
                        <strong>Telefon (Vršac):</strong> 0695620121<br>
                </div>
                <div class="footer">
            <img src="https://stopakambalaza.com/images/logos/StoPak%20-%20logo.svg" alt="Logo" class="logo" />
            <p>&copy; ${new Date().getFullYear()} Vaša prodavnica. Sva prava zadržana.</p>
        </div>
            </div>
        </body>
        </html>
      `;
  },
  sold: (productArray, orderNumber, buyer, address_for_order, description) => {
    return `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Potvrda Prodaje</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
                .container {
                    width: 70%;
                    margin: 0 auto;
                    border: 1px solid #ddd;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #000;
                    padding: 10px;
                    text-align: center;
                }
                .content {
                    margin-top: 20px;
                }
                .content p {
                    margin: 0 0 10px;
                }
                .table-container {
                    margin-top: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                .totals {
                    margin-top: 20px;
                }
                .header h1 {
                    color: #fff;
                }
                .totals td {
                    padding: 5px 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Čestitamo na uspešnoj prodaji!</h1>
                </div>
                <div class="content">
                    <p>Pozdrav!</p>
                    <p>Vaš proizvod je uspešno prodat.</p>
                    <p><strong>[Narudžbina ${orderNumber}] ${new Date().toLocaleDateString()}</strong></p>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Proizvod</th>
                                    <th>Količina</th>
                                    <th>Veličina</th>
                                    <th>Cena</th>
                                    <th>Ukupno bez PDV-a</th>
                                    <th>Ukupno</th>
                                </tr>
                            </thead>
                            <tbody>
                             ${productArray.orderedProducts
                               .map(
                                 (product) => `
                                <tr>
                                    <td>${product.productId.title}</td>
                                    <td>${product.quantity || 1}</td>
                                    <td>${product.size ? product.size : ""}</td>
                                    <td>${product.price.toFixed(2)} rsd</td>
                                    <td>${(product.price / 1.2).toFixed(
                                      2
                                    )} rsd</td>
                                    <td>${(
                                      (product.quantity || 1) * product.price
                                    ).toFixed(2)} rsd</td>
                                </tr>
                                `
                               )
                               .join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="totals">
                        <table>
                            <tbody>
                                <tr>
                                    <td><strong>Ukupno:</strong></td>
                                    <td><strong>${
                                      productArray.totalPrice
                                    } rsd</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="address">
                        <p><strong>Adresa za isporuku</strong></p>
                        <p>${buyer.firstName ? buyer.firstName : ""} ${
      buyer.lastName ? buyer.lastName : ""
    } ${buyer.companyName ? buyer.companyName : ""}.
                       <br><strong>Adresa:</strong> ${address_for_order}<br>
                    <strong>Telefon:</strong> ${
                      buyer.phone &&
                      Array.isArray(buyer.phone) &&
                      buyer.phone.length > 0
                        ? buyer.phone[0]
                        : "N/A"
                    }<br>
                    <strong>Email:</strong> ${buyer.email}<br>
                    <strong>Beleska:</strong> ${description}<br>
                </p>
                </div>
                <div class="footer">
            <img src="https://stopakambalaza.com/images/logos/StoPak%20-%20logo.svg" alt="Logo" class="logo" />
        </div>
            </div>
        </body>
        </html>
    `;
  },
};

const shopEmailsHandler = async (
  product,
  buyer,
  orderNumber,
  address_for_order,
  email,
  description,
  type
) => {
  console.log("description---->", description);

  let productArray = [];
  // console.log("product", product);
  // console.log("buyer--------------------", buyer);
  //   console.log("orderNumber", orderNumber);
  // console.log("address_for_order", address_for_order);
  // console.log("email", email);
  // console.log("type", type);

  let message;

  switch (type) {
    case "sold":
      const orderForSold = await Order.findOne({
        orderNumber: orderNumber,
      }).populate("orderedProducts.productId");

      if (!orderForSold) {
        throw new Error("Order not found");
      }

      console.log("ORDER ZA PRODAT", orderForSold.orderedProducts);
      message = {
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: "Uspešno ste prodali proizvod",
        html: emailTemplates.sold(
          orderForSold,
          orderNumber,
          buyer,
          address_for_order,
          description || "--"
        ),
      };
      break;
    case "bought":
      const order = await Order.findOne({ orderNumber: orderNumber }).populate(
        "orderedProducts.productId"
      );

      if (!order) {
        throw new Error("Order not found");
      }
      console.log("order", order);
      message = {
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: "Uspešno ste kupili proizvod",
        html: emailTemplates.bought(
          order,
          orderNumber,
          buyer,
          address_for_order,
          description || "--"
        ),
      };
      break;
    default:
      throw new Error("Unknown email type");
  }

  try {
    await sgMail.send(message);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
module.exports = { shopEmailsHandler };
