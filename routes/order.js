const express = require("express");
const router = express.Router();

// import middlware for validating user
const {
    loggedInUser,
    customeRoles
} = require("../middlewares/userValidator");

// import controller
const { createOrder } = require("../controllers/orderController");

router.route('/order/create').post(loggedInUser,createOrder)

module.exports = router;