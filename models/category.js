const mongoose = require('mongoose');
;
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Name is required",
        minLength: [2, "Too short"],
        maxLength: [32, "Too long"],
    },
    slug: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        index: true,
    },

}, { timestamps: true })



module.exports = mongoose.model("Category", categorySchema)