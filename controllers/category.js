const Category = require("../models/category.js");
const Product = require("../models/product.js");
const Sub = require("../models/sub.js");
const slugify = require('slugify')

const create = async (req, res) => {
    try {
        const { name } = req.body;
        // Create the category object with slug
        const category = new Category({
            name,
            slug: slugify(name, { lower: true }) // Ensure slug is in lowercase
        });

        const newCategory = await category.save();
        res.json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(400).send('Create category failed');
    }
};

const read = async (req, res) => {

    const category = await Category.findOne({ slug: req.params.slug }).exec();

    // res.status(200).json(category)
    const product = await Product.find({ category })
        .populate('category')
        .exec()
    res.status(200).json({
        category,
        product
    })

}

const update = async (req, res) => {

    const { name } = req.body
    try {
        const updated = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        )

        res.json(updated)
    } catch (error) {
        res.status(400).send("Category update failed!")
    }
}

const remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ slug: req.params.slug })

        res.send(deleted)

    } catch (error) {
        console.log(error)
        res.status(400).send("Failed to delete category!")
    }
}

const list = async (req, res) => {
    res.json(await Category.find({}).sort({ createdAt: -1 }).exec())
}

const getSubs = (req, res) => {
    Sub.find({ parent: req.params._id }).exec((err, subs) => {
        console.log(err)
        res.json(subs)
    })
}

module.exports = { create, read, update, remove, list, getSubs }