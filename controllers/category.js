const Category = require("../models/category.js");
const slugify = require('slugify')

const create = async (req, res) => {
    try {
        const { name } = req.body
        // const category = await new Category({ name, slug: slugify(name)})
        res.json(await new Category({ name, slug: slugify(name) }))
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(400).send('Create category failed')
    }
}

const read = async () => { }

const update = async () => { }

const remove = async () => { }

const list = async () => { }



module.exports = { create, read, update, remove, list }