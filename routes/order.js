const express = require("express");
const router = express.Router();

// import middlware for validating user
const {
    loggedInUser,
    customeRoles
} = require("../middlewares/userValidator");

// import controller
const { createOrder,getOneOrder,getLoggedinOrder,adminGetOrder } = require("../controllers/orderController");

router.route('/order/create').post(loggedInUser,createOrder)
router.route('/order/:id').get(loggedInUser,getOneOrder)
router.route('/myorder').get(loggedInUser,getLoggedinOrder)


// admin route set up
router.route('/admin/order').get(loggedInUser,customeRoles("admin"),adminGetOrder);

module.exports = router;