const express=require("express");
const router=express.Router();

// import middlware for validating user
const {loggedInUser,customeRoles}=require("../middlewares/userValidator");

// import controller
const {addNewProduct, getAllProduct, admingetAllProducts, getOneProduct}=require("../controllers/productController");

// user routes
router.route("/products").get(loggedInUser,getAllProduct);
router.route("/product/:id").get(loggedInUser,getOneProduct);

// admin route
router.route("/admin/addproducts").post(loggedInUser,customeRoles('manager','admin'),addNewProduct);
router.route("/admin/adminAllProducts").get(loggedInUser,customeRoles('manager','admin'),admingetAllProducts);

module.exports=router;