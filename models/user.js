const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        indexed: true,
    },
    role: {
        type: String,
        default: "Subscriber",
    },
    cart: {
        type: Array,
        default: []
    },
    address: String,
    wishlist: [{ type: ObjectId, ref: "Product" }]
}, { timestamps: true })
module.exports = mongoose.model("User", userSchema)