const Merchant = require("./models/bankMerchant.models");

//TODO:Kada merchant hoce da stavi novu mogucnost u sistemu, dodati SAMO PAYMENT METHOD U TO I CRUD ZA FUNKCIONISANJE TOGA
exports.create = async (req, res) => {
  try {
    const { merchantId, merchantName, merchantPassword, merchantEmail } =
      req.body; // Dohvaćanje podataka iz zahtjeva

    if (!merchantId || !merchantName || !merchantPassword || !merchantEmail) {
      return res.status(400).json({ message: "Bad request" });
    }

    const merchant = new Merchant({
      merchantId,
      merchantName,
      merchantPassword,
      merchantEmail,
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


