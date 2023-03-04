const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const fileUploader = require("express-fileupload");
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

exports.postform = (req, res) => {
  res.render("postform");
};
