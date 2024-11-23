const Merchant = require("./models/merchant.models");

exports.create = async (req, res) => {
  try {
    const {
      merchantId,
      merchantName,
      merchantPassword,
      merchantEmail,
      allowedPaymentMethods,
    } = req.body; // Dohvaćanje podataka iz zahtjeva

    if (
      !merchantId ||
      !merchantName ||
      !merchantPassword ||
      !merchantEmail ||
      !allowedPaymentMethods
    ) {
      return res.status(400).json({ message: "Bad request" });
    }

    const merchant = new Merchant({
      merchantId,
      merchantName,
      merchantPassword,
      merchantEmail,
      allowedPaymentMethods,
    });

    await merchant.save();

    res
      .status(201)
      .json({ message: "Uspesno smo kreirali prodavca", merchant });
  } catch (error) {
    console.log("register :: INNER TRY :: error =", error);
    res.status(500).json({ message: error.message });
  }
};
