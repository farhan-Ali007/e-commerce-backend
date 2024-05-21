const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32,
        text: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true

    },
    description: {
        type: String,
        required: true,
        maxLength: 2000,
        text: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 32,
    },
    category: {
        type: ObjectId,
        ref: "Category"
    },
    subs: [{
        type: ObjectId,
        ref: "Sub",
    }],
    quantity: Number,
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    shipping: {
        type: String,
        enum: ["Yes", "No"]
    },
    color: {
        type: String,
        enum: ["Black", "Silver", "Brown", "Blue", "Orange", "Red", "White", "Purple", "Pink", "Yellow"]
    },
    brand: {
        type: String,
        enum: ["Apple", "Samsung", "Lenovo", "HP", "ASUS", "Microsoft"]
    },
    // ratings: [{
    //     star: Number,
    //     postedBy: {
    //         type: ObjectId,
    //         ref: "User"
    //     }
    // }]
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)