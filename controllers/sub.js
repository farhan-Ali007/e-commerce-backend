const Sub = require("../models/sub.js");
const slugify = require('slugify')
const Product = require("../models/product.js")

const create = async (req, res) => {
    try {
        const { name, parent } = req.body;

        const subCategory = new Sub({
            name,
            parent,
            slug: slugify(name, { lower: true })
        });

        const newCategory = await subCategory.save();
        res.json(newCategory);
    } catch (error) {
        console.error("Error creating sub:", error);
        res.status(400).send('Create sub failed');
    }
};

const read = async (req, res) => {

    const sub = await Sub.findOne({ slug: req.params.slug }).exec();

    const product = await Product.find({ subs: sub })
        .populate('category')
        .exec()
    res.status(200).json({
        sub,
        product
    })
}

const update = async (req, res) => {

    const { name, parent } = req.body
    try {
        const updated = await Sub.findOneAndUpdate(
            { slug: req.params.slug },
            { name, parent, slug: slugify(name) },
            { new: true }
        )

        res.json(updated)
    } catch (error) {
        res.status(400).send("Subcategory update failed!")
    }
}

const remove = async (req, res) => {
    try {
        const deleted = await Sub.findOneAndDelete({ slug: req.params.slug })

        res.send(deleted)

    } catch (error) {
        console.log(error)
        res.status(400).send("Failed to delete subcategory!")
    }
}

const list = async (req, res) => {
    res.json(await Sub.find({}).sort({ createdAt: -1 }).exec())
}



module.exports = { create, read, update, remove, list }