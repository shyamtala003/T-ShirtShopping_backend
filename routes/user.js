const express = require("express");
const router = express.Router();

// import controllers
const {
  signup,
  postform,
  login,
  logout,
  forgotPassword,
} = require("../controllers/useController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/postform").get(postform);

module.exports = router;
