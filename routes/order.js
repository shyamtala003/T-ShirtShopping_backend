const express = require("express");
const router = express.Router();

// import middlware for validating user
const {
    loggedInUser,
    customeRoles
} = require("../middlewares/userValidator");

// import controller
const { createOrder,getOneOrder } = require("../controllers/orderController");

router.route('/order/create').post(loggedInUser,createOrder)
router.route('/order/:id').get(loggedInUser,getOneOrder)

module.exports = router;