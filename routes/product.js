const express=require("express");
const router=express.Router();

// import controller
const {product}=require("../controllers/productController");

router.route("/products").get(product);

module.exports=router;