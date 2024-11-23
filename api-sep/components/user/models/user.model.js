const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      trim: true,
      enum: ["customer"],
      default: null,
    },
    email: { type: String,unique: true, required: true },
    emailToUpdate: { type: String, required: false, default: null },
    user_role: {
      type: String,
      default: null,
    },
    password: { type: String, required: true, default: "null" },
    firstName: { type: String, required: false, default: "", trim: true },
    lastName: { type: String, required: false, default: "", trim: true },
    companyName: { type: String, required: false, default: "", trim: true },
    PIB: { type: String, required: false, default: "", trim: true },
    address: { type: String, trim: true },
    phone: [{ type: String, trim: true }],
    authType: { type: String, default: "basic", trim: true },
    userType: { type: String, default: "customer" },
    emailToken: { type: String, default: "null" },
    passwordToken: { type: String, default: "null" },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "DELETED", "WAITING_FOR_ACTIVATION"],
      default: "WAITING_FOR_ACTIVATION",
    },
  },
  { timestamps: true }
);

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.pre("save", async function save(next) {
  this.firstName.replace(/^\w/, (c) => c.toUpperCase());
  this.lastName.replace(/^\w/, (c) => c.toUpperCase());

  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("User", userSchema);
