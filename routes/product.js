const express=require("express");
const router=express.Router();

// import middlware for validating user
const {loggedInUser}=require("../middlewares/userValidator");

// import controller
const {addNewProduct}=require("../controllers/productController");

router.route("/addproducts").post(loggedInUser,addNewProduct);

module.exports=router;