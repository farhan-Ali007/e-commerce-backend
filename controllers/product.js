const Product = require('../models/product.js')
const slugify = require('slugify')

const create = async (req, res, next) => {
    try {
        console.log("Request.body====>",req.body)

        req.body.slug = slugify(req.body.title)

        const newProduct = await Product.create(req.body)
        newProduct.save();

        res.json(newProduct)

    } catch (error) {
        console.log('Creating product failed',error)
        res.status(400).send("Creating product failed!")
    }
}

module.exports =  create ;