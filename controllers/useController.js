const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const emailHelper = require("../utils/emainHelper");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  try {
    // 1.collect information from user
    let { name, email, password } = req.body;
    email = String(email).toLowerCase();

    // 2.check all required filleds are filled up or not
    if (!(name && email && password)) {
      return res.send("plase provide name,email and password");
    }

    // 3.check user is already exist
    let user = await User.findOne({ email });
    if (user) {
      return res.send("user already exist");
    }

    // get image for profile
    let imageResult;
    if (req.files.photo) {
      imageResult = await cloudinary.v2.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "users",
          width: 150,
          crop: "scale",
        }
      );
    } else {
      return res.status(401).send("please upload image for profile");
    }

    // 4.create new user
    user = await User.create({
      name,
      email,
      password,
      photo: {
        id: imageResult.public_id,
        secure_url: imageResult.secure_url,
      },
    });

    // generate a token and send it in cookie and json response
    cookieToken(user, res);
  } catch (error) {
    res.send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    // 1.collect data from user
    let { email, password } = req.body;
    email = String(email).toLowerCase();

    //2.check user data exist or not
    if (!(email && password)) {
      return res.status(402).send("please enter email and password");
    }

    // 3.fetch data from database using email
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .send("no user found in over records from this email: " + email);
    }

    // 4.compare password
    let isPasswordMatched = await user.isValidatedPassword(password);
    if (!isPasswordMatched) {
      return res.status(401).send("invalid password");
    }

    // 5.if all is good then send token in cookie
    // generate a token and send it in cookie and json response
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").send("user loggedout succefully");
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    // 1.check email filled up or not by user
    if (!email)
      return res.status(401).send("email is required for forgot password");

    // 2.check email exist or not
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not exist");
    }

    // 3.generate token and store into database
    let token = user.getForgotPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 4.send email with token
    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}api/v1/password/reset/${token}`;

    const html = `
    <p>Please click on the following link to reset your password:</p>
    <p><a href="${myUrl}">${myUrl}</a></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `;

    try {
      await emailHelper({
        to: user.email,
        subject: "reset password",
        text: "reset password",
        html,
      });
      res.status(200).json({ success: true, msg: "email sent successfully" });
    } catch (error) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let token = req.params.token;
    token = crypto.createHash("sha256").update(token).digest("hex");

    let user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      res.status(403).send("token is invalid or expired");
    }

    if (!(req.body.password && req.body.conformPassword)) {
      res.status(402).send("please enter password and comform password");
    }

    if (req.body.password !== req.body.conformPassword) {
      res.status(402).send("password and confirm password not matched");
    }

    user.password = req.body.password;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    user = await user.save();

    // if everything is good then send token
    cookieToken(user, res);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserLoggedIn = async (req, res) => {
  try {
    if (!req.user) {
      res.status(403).send("You must be logged in");
    }

    let user = await User.findById(req.user.id);
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    // 1. get user via middlware req.user
    let user = await User.findById(req.user.id).select("+password");

    // 2. collect old and and new password from user and validate old password also
    if (!(req.body.newPassword && req.body.oldPassword)) {
      return res.send("please enter password and old password");
    }

    let isPasswordValid = await user.isValidatedPassword(req.body.oldPassword);

    if (!isPasswordValid) {
      return res.send("current password is not valid");
    }

    user.password = req.body.newPassword;
    user = await user.save();

    // generate new cookie
    cookieToken(user, res);
  } catch (error) {
    res.send(error.message);
  }
};

exports.postform = (req, res) => {
  res.render("postform");
};
