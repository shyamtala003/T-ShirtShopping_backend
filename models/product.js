const mongoose = require("mongoose");

// name
// price
// description
// photos[]
// category
// brand
// stock
// rating
// numOfReviews
// reviews[user,name,rating,comment]
// user
// created_at
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name should be required"],
        trim: true,
        maxlength: [20, "product name should not be longer than 20 characters"],
    },
    price: {
        type: Number,
        required: [true, "product price should be required"],
        maxlength: [5, "product price should not be longer than 5 digits"],
    },
    description: {
        type: String,
        required: [true, "product description should be required"],
    },
    photos: [{
        id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true
        },
    }],
    category: {
        type: String,
        required: [
            true,
            "please select category from- short-sleeves, long-sleeves, sweat-shirts, hoodies",
        ],
        enum: {
            values: ["shortsleeves", "longsleeves", "sweatshirt", "hoodies"],
            message: "please select category ONLY from - short-sleeves, long-sleeves, sweat-shirts and hoodies ",
        },
    },
    brand: {
        name: {
            type: String,
            required: [true, "brand name should be required"],
            trim: true,
            maxlength: [20, "brand name should not be longer than 20 characters"],
        }
    },
    stock: {
        type: Number,
        required: [true, "product stock should be required"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    numberOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    }, ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model("Product", productSchema);