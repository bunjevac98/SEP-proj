const Merchant = require("./models/merchant.models");

//TODO:Kada merchant hoce da stavi novu mogucnost u sistemu, dodati SAMO PAYMENT METHOD U TO I CRUD ZA FUNKCIONISANJE TOGA
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

exports.getAllPaymentMethodsByMerchant = async (req, res) => {
  try {
    const merchantid = req.params.id;
    const merchant = await Merchant.findOne({ merchantId: merchantid });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Merchant.find();
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMerchantPaymentMethods = async (req, res) => {
  try {
    const merchantId = req.params.id;

    //treba da ide id od allowedPaymentMethods tj od payment methods
    const { allowedPaymentMethods } = req.body;

    const merchant = await Merchant.findOne({ merchantId });

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    merchant.allowedPaymentMethods = allowedPaymentMethods;

    await merchant.save();

    return res
      .status(200)
      .json({ message: "Merchant payment methods updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
