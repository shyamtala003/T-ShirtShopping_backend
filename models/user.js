const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name should be required"],
    trim: true,
    maxlength: [40, "name should not be more then 40 charecter"],
  },
  email: {
    type: String,
    required: [true, "Email should be required"],
    validate: [validator.isEmail, "Email address is invalid"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password should be required"],
    trim: true,
    minlength: [6, "Password should be atleast 6 charecter"],
    select: false,
  },
  photo: {
    id: {
      type: String,
      required: [true, "please provide a id of profile image"],
    },
    secure_url: {
      type: String,
      required: [true, "please provide a secure url of profile image"],
    },
  },
  role: {
    type: String,
    enum: ["user","manager", "admin"],
    default: "user",
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypt the password using bcryptjs and mongoose pre hook(middleware)
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// validate password using mongoose methods and bcryptjs
UserSchema.methods.isValidatedPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate jsonwebtoken using jsonwebtoken and mongoose methods
UserSchema.methods.generateJwtToken = function () {
  const jwtPayload = {
    id: this._id,
  };

  const jwtOptions = {
    expiresIn: process.env.JWT_EXPIRY,
  };

  return jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);
};

// generate forgotpasswordToken usgin crpto node default package
UserSchema.methods.getForgotPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // token expiry
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return token;
};
module.exports = mongoose.model("User", UserSchema);
