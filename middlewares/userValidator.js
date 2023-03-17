const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.loggedInUser = async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    (req.header("Authorization")
      ? req.header("Authorization").replace("Bearer ", "")
      : false);

  // 2.if token to exist then send error response
  if (!token) {
    return res.status(402).json({success:false,error:"token not found"});
  }

  let decode;
  try {
    decode = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // 3.if token is not validated
    return res.status(402).send("token is not validate " + error.message);
  }

  // 4. if token is validate then find user in database
  let user = await User.findById({ _id: decode.id });
  req.user = user;

  next();
};

exports.customeRoles = (...role) => {
  return (req, res, next) => {
      if (!role.includes(req.user.role)) {
        return res
          .status("404")
          .json({ success: false, error: "Access Denied" });
      }
      next();
  }
};
