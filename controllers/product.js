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



const listAll = async (req, res) => {
    try {
        const count = parseInt(req.params.count);
        const products = await Product.find({})
            .limit(count)
            .populate('category')
            .populate('subs')
            .sort([['createdAt', "desc"]])
            .exec();

        res.json(products);
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({ error: 'Failed to list products' });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.staus(400).send("Product delete failed");
    }
}

const read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("subs")
        .exec()

    res.json(product)
}

const update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }

        const updated = await Product.findOneAndUpdate({ slug: req.params.slug },
            req.body,
            { new: true }
        )
            .exec();

        res.json((updated))

    } catch (err) {
        console.log("Product update error ====>", err);
        // return res.status(400).send("Product update failed")
        res.status(400).json({
            error: err.message
        });
    }
}



module.exports = { create, listAll, remove, read, update };