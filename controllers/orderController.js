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
            user: req.user.id,
          });
        
          res.status(200).json({
            success: true,
            order
          });
    } catch (error) {
        res.status(403).json({success:false,error: error.message});
    }
}

exports.getOneOrder=async (req, res)=>{
    try {
        const order = await Order.findById(req.params.id).populate('user',"name email");
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(403).json({success:false,error: error.message});
    }
}