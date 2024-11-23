const dotenv = require("dotenv");
const User = require("./models/user.model");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

exports.create = async (req, res) => {
  console.log(req.body);
  const prevUser = await User.findOne({
    email: req.body.email,
    userType: "customer",
  });

  if (prevUser) {
    return res.status(401).json({ message: "User vec postoji" });
  }

  try {
    const user = new User(req.body);

    const emailToken = uuidv4();
    user.emailToken = emailToken;
    user.status = "ACTIVE";

    const dataAfter = await user.save();
    console.log(dataAfter);
    return res.status(201).json({
      message: "Uspesno smo kreirali korisnika",
      user: dataAfter,
    });
  } catch (error) {
    console.log("register :: INNER TRY :: error =", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await User.find();

    if (!data || data.length < 1) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijednog korisnika" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status * (500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(404)
        .json({ message: "Nismo dobro priili Id od korisnika" });
    }
    console.log(userId);
    const user = await User.findById({
      _id: mongoose.Types.ObjectId.createFromHexString(userId),
    });

    console.log(user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijednog korisnika" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {};

exports.delete = async (req, res) => {};
