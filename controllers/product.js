const Product = require('../models/product.js')
const slugify = require('slugify')

const mongoose = require('mongoose');
const create = async (req, res) => {
    try {
        console.log("Request.body====>", req.body)

        // Check if category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
            return res.status(400).json({
                error: "Invalid category ID"
            });
        }

        req.body.slug = slugify(req.body.title)

        const newProduct = await Product.create(req.body)
        newProduct.save();

        res.status(200).json(newProduct)

    } catch (err) {
        console.log('Creating product failed', err)
        res.status(400).json({
            error: err.message
        });
    }
}


const read = async (req, res) => {

    const products = await Product.find({})

    res.json(products)

}

module.exports = { create, read };