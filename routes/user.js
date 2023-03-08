const express = require("express");
const router = express.Router();

// import middleware
const { loggedInUser } = require("../middlewares/userValidator");

// import controllers
const {
  signup,
  postform,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserLoggedIn,
  updatePassword,
  updateUser,
} = require("../controllers/useController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(loggedInUser, getUserLoggedIn);
router.route("/password/reset").post(loggedInUser, updatePassword);
router.route("/user/update").post(loggedInUser, updateUser);
// router.route("/userdashboard").get(loggedInUser);
router.route("/postform").get(postform);

module.exports = router;
