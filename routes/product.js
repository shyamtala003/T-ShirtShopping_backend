const express=require("express");
const router=express.Router();

// import middlware for validating user
const {loggedInUser,customeRoles}=require("../middlewares/userValidator");

// import controller
const {addNewProduct, getAllProduct}=require("../controllers/productController");

// user routes
router.route("/products").get(loggedInUser,getAllProduct);

// admin route
router.route("/admin/addproducts").post(loggedInUser,customeRoles('manager','admin'),addNewProduct);

module.exports=router;