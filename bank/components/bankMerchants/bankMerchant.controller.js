const Merchant = require("./models/bankMerchant.models");

//TODO:Kada merchant hoce da stavi novu mogucnost u sistemu, dodati SAMO PAYMENT METHOD U TO I CRUD ZA FUNKCIONISANJE TOGA
exports.create = async (req, res) => {
  try {
    const {
      merchantId,
      merchantName,
      merchantPassword,
      merchantEmail,
      isActive,
      merchantCard,
    } = req.body;

    if (!merchantId || !merchantName || !merchantPassword || !merchantEmail) {
      return res.status(400).json({ message: "Bad request" });
    }
    console.log("merchantCard:", merchantCard);

    const merchant = new Merchant({
      merchantId,
      merchantName,
      merchantPassword,
      merchantEmail,
      isActive: true,
      merchantCard: merchantCard || null,
    });

    await merchant.save();

    return res
      .status(201)
      .json({ message: "Uspesno smo kreirali prodavca", merchant });
  } catch (error) {
    console.log("register :: INNER TRY :: error =", error);
    res.status(500).json({ message: error.message });
  }
};
