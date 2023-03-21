const express = require("express");
const router = express.Router();
const { sendStripeKey, sendRazorpaypeKey, captureStripePayment, captureRazorpayPayment } = require("../controllers/paymentController");

// import middlware for validating user
const { loggedInUser } = require("../middlewares/userValidator");

  
  router.route("/stripekey").get(loggedInUser, sendStripeKey);
  router.route("/razorpaykey").get(loggedInUser, sendRazorpaypeKey);
  
  router.route("/capturestripe").post(loggedInUser, captureStripePayment);
  router.route("/capturerazorpay").post(loggedInUser, captureRazorpayPayment);
  
  module.exports = router;