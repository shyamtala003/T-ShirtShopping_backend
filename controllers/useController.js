const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");

exports.signup = async (req, res) => {
  try {
    // 1.collect information from user
    let { name, email, password } = req.body;

    // 2.check all required filleds are filled up or not
    if (!(name && email && password)) {
      return res.send("plase provide name,email and password");
    }

    // 3.check user is already exist or not (this task done by mongoose use model because there i set password must unique needed)

    // 4.create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // generate a token and send it in cookie and json response
    cookieToken(user, res);
  } catch (error) {
    res.send(error.message);
  }
};
