const Product = require("../models/product");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");
const mongoose = require("mongoose");
const {
    myWhereClause
} = require("../utils/myWhereClause");

exports.addNewProduct = async (req, res) => {
    try {
        // upload all product images
        // variable for inserting product images into DB
        let imageObject = [];

        // 1. check req.files exists or not
        if (!req.files) {
            return res.status(400).json({
                success: false,
                error: "No files were uploaded.",
            });
        }

        if (req.files) {
            // code for uploading just signle images
            if (!Array.isArray(req.files.photos)) {
                let filedata = req.files.photos;
                let result = await cloudinary.v2.uploader.upload(
                    filedata.tempFilePath, {
                        folder: "products",
                    }
                );
                imageObject.push({
                    id: result.public_id,
                    secure_url: result.secure_url,
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
            photos: imageObject,
            brand: req.body.brand,
            stock: req.body.stock,
            category: req.body.category,
            user: req.user._id,
        };

        let product = await Product.create(productInfo);
        res.status(201).json({
            success: true,
            product: product,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message,
        });
    }
};

exports.getAllProduct = async (req, res) => {
    try {

        // for counting number of product exist in databse
        const totalcountProduct = await Product.countDocuments();


        let products;
        let quert = myWhereClause(Product, req.query);
        if (req.query.page) {
            let resultperPage = 2;
            let currentPage = req.query.page;
            const skipVal = resultperPage * (currentPage - 1);
            products = await Product.find(quert).limit(resultperPage).skip(skipVal);
        } else {
            products = await Product.find(quert);
        }
        res.status(200).json({
            success: true,
            products,
            totalcountProduct,
            resultLength: products.length
        });


        // class base code for filtering the products
        // const resultPerPage = 6;
        // const totalcountProduct = await Product.countDocuments();

        // const productsObj = new WhereClause(Product, req.query)
        //   .search()
        //   .filter();

        // let products = await productsObj.base;
        // const filteredProductNumber = products.length;

        // //products.limit().skip()

        // productsObj.pager(resultPerPage);
        // products = await productsObj.base.clone();

        // res.status(200).json({
        //   success: true,
        //   products,
        //   filteredProductNumber,
        //   totalcountProduct,
        // });

    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

exports.getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById({_id:String(req.params.id)});

        if (!product) {
            return res.status(403).json({
                success: false,
                error: "no such product available in our site."
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
}




exports.admingetAllProducts = async (req, res) => {
    let products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
}

exports.adminGetOneProduct = async (req, res) => {
    try {
        const product = await Product.findById({_id:String(req.params.id)});

        if (!product) {
            return res.status(403).json({
                success: false,
                error: "no such product available in our site."
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
}

exports.adminUpdateOneProduct = async (req, res) => {
    try {
        // 1. find the product
        if(!mongoose.isValidObjectId(req.params.id))
        {
            return res.status(403).json({
                success: false,
                error: "no such product available in our site."
            });
        }

        const product = await Product.findById(req.params.id);

        // variable for inserting product images into DB
        let imageObject = [];

        // 2. check if the product available
        if (!product) {
            return res.status(403).json({
                success: false,
                error: "no such product available in our site."
            });
        }

        // 3.. update the files if new file is available
        if (req.files) {

            // 1. delete old product images
            if (product.photos) {
                for (let index = 0; index < product.photos.length; index++) {
                    await cloudinary.v2.uploader.destroy(product.photos[index].id);
                }
            }

            // 2. upload the new t-shirt images
            // code for uploading just signle images
            if (!Array.isArray(req.files.photos)) {
                let filedata = req.files.photos;
                let result = await cloudinary.v2.uploader.upload(
                    filedata.tempFilePath, {
                        folder: "products",
                    }
                );
                imageObject.push({
                    id: result.public_id,
                    secure_url: result.secure_url,
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
            // set photos info into req.body
            req.body.photos = imageObject;
        }

        // 4. update the product
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindModified: false,
        });

        res.status(200).json({success:true,message:"product updated successfully",updatedProduct:updatedProduct});


    } catch (err) {
        res.status(403).json({
            success: false,
            error: err.message
        });
    }
}

exports.adminDeleteOneProduct = async (req, res) => {
    try {
        // 1. check id is valid or not
        if(!mongoose.isValidObjectId(req.params.id))
        {
            return res.status(403).json({
                success: false,
                error: "no such product available in our site."
            });
        }

        // 2. fetch product info from db
        const product = await Product.findById(req.params.id);

        // 3. check if the product available
        if (!product) {
            return res.status(403).json({
                success: false,
                error: "no such product available in our site."
            });
        }

        // 4. delete old product images
        if (product.photos) {
            for (let index = 0; index < product.photos.length; index++) {
                cloudinary.v2.uploader.destroy(product.photos[index].id);
            }
        }
        
        // 4. update the product
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({success:true,message:"product deleteded successfully",deletedProduct});


    } catch (err) {
        res.status(403).json({
            success: false,
            error: err.message
        });
    }
}