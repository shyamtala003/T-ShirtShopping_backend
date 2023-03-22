const Product=require("../models/product");
const Order=require("../models/order");

exports.createOrder=async(req,res)=>{
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
          } = req.body;
        
          const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            taxAmount,
            shippingAmount,
            totalAmount,
            user: req.user._id,
          });
        
          res.status(200).json({
            success: true,
            order,
          });
    } catch (error) {
        res.status(403).json({success:false,error: error.message});
    }
}