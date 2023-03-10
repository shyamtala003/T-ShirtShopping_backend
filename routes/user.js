const express = require("express");
const router = express.Router();

// import middleware
const { loggedInUser, customeRoles } = require("../middlewares/userValidator");

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
  adminAllUsers,
  managerAllUsers,
  adminSelectedUser,
  adminUpdateOneUser,
  adminDeleteOneUser,
} = require("../controllers/useController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(loggedInUser, getUserLoggedIn);
router.route("/password/reset").post(loggedInUser, updatePassword);
router.route("/user/update").post(loggedInUser, updateUser);

// admin only route
router
  .route("/admin/users")
  .get(loggedInUser, customeRoles("admin"), adminAllUsers);
router
  .route("/admin/user/:id")
  .get(loggedInUser, customeRoles("admin"), adminSelectedUser)
  .put(loggedInUser, customeRoles("admin"), adminUpdateOneUser)
  .delete(loggedInUser, customeRoles("admin"), adminDeleteOneUser);

// manager only route
router
  .route("/manager/users")
  .get(loggedInUser, customeRoles("manager"), managerAllUsers);

router.route("/postform").get(postform);

module.exports = router;
