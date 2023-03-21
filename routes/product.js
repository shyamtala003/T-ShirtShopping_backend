const express = require("express");
const router = express.Router();

// import middlware for validating user
const {
    loggedInUser,
    customeRoles
} = require("../middlewares/userValidator");

// import controller
const {
    addNewProduct,
    getAllProduct,
    admingetAllProducts,
    getOneProduct,
    adminUpdateOneProduct,
    adminDeleteOneProduct,
    adminGetOneProduct
} = require("../controllers/productController");

// user routes
router.route("/products").get(loggedInUser, getAllProduct);
router.route("/product/:id").get(loggedInUser, getOneProduct);

// admin route
router.route("/admin/addproducts").post(loggedInUser, customeRoles('admin'), addNewProduct);
router.route("/admin/adminAllProducts").get(loggedInUser, customeRoles('manager', 'admin'), admingetAllProducts);
router.route("/admin/adminGetOneProduct/:id").get(loggedInUser, customeRoles('manager', 'admin'), adminGetOneProduct);
router.route("/admin/adminUpdteOneProduct/:id").put(loggedInUser, customeRoles('admin'), adminUpdateOneProduct);
router.route("/admin/adminDeleteOneProduct/:id").delete(loggedInUser, customeRoles('admin'), adminDeleteOneProduct);

module.exports = router;