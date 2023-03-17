const Product = require('../models/product');
const cloudinary = require('cloudinary');



exports.addNewProduct = async (req, res) => {
    try {

        

        // upload all product images
        // variable for inserting product images into DB
        let imageObject = [];

        // 1. check req.files exists or not
        if (!req.files) {
            return res.status(400).json({
                success: false,
                error: "No files were uploaded."
            });
        }

        if (req.files) {
            
            
            // code for uploading just signle images
            if (!Array.isArray(req.files.photos)) {
                let filedata = req.files.photos;
                let result = await cloudinary.v2.uploader.upload(filedata.tempFilePath, {
                    folder: "products",
                });
                imageObject.push({
                    id: result.public_id,
                    secure_url: result.secure_url
                });
            }

            //   code for uploading multiple files
            if (Array.isArray(req.files.photos)) {
                let result = [];
                if (req.files) {
                    for (var i = 0; i < req.files.photos.length; i++) {
                        result.push(
                            cloudinary.v2.uploader.upload(req.files.photos[i].tempFilePath, {
                                folder: "products",
                            })
                        );
                    }

                    let finalOutput = await Promise.all(result);

                    for (let index = 0; index < finalOutput.length; index++) {
                        imageObject.push({
                            id: finalOutput[index].public_id,
                            secure_url: finalOutput[index].secure_url,
                        });
                    }
                }
                
            }    
        }

        let productInfo = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            photos:imageObject,
            brand: req.body.brand,
            stock: req.body.stock,
            category: req.body.category,
            user : req.user._id

        };

        let product=await Product.create(productInfo);
        res.status(201).json({
            success: true,
            product: product
        });


    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
}