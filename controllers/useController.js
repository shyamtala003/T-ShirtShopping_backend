const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");

exports.signup = async (req, res) => {
  try {
    // 1.collect information from user
    let { name, email, password } = req.body;

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
    const { email, password } = req.body;

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

exports.postform = (req, res) => {
  res.render("postform");
};
