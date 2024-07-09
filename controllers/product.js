const Product = require('../models/product.js')
const slugify = require('slugify')

const mongoose = require('mongoose');
const User = require('../models/user.js');
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

// const list = async (req, res) => {
//     try {
//         //createdat/updatedAt , ascending order/descendind order
//         const { sort, order, limit } = req.body;

//         // console.log('Received sort:', sort);
//         // console.log('Received order:', order);
//         // console.log('Received limit:', limit);


//         const products = await Product.find({})
//             .populate('category')
//             .populate('subs')
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec()


//         // console.log('Fetched products:', products);
//         res.json(products)

//     } catch (err) {
//         console.log(err)
//     }
// }

//With pagination


const list = async (req, res) => {
    try {
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();

        console.log('Fetched products:', products); // Debugging line
        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const productsCount = async (req, res) => {

    const total = await Product.find({}).estimatedDocumentCount().exec()

    res.json(total)
}

const productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
};

const listRelated = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).exec();
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const related = await Product.find({
            _id: { $ne: product._id },
            category: product.category
        })
            .limit(3)
            .populate('category')
            .populate('subs')
            .populate('postedBy')
            .exec();

        res.json(related);
    } catch (err) {
        console.error('Error fetching related products:', err);
        res.status(500).json({ error: 'Failed to fetch related products' });
    }
};

//Search / Filter

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()
    res.json(products)
}

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1]
            }
        })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec()
        res.json(products)
    } catch (error) {
        console.log(error)
        res.status(500).send('Server error')
    }
}

const handleCategory = async (req, res, category) => {
    try {
        const products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec()
        res.json(products)
    } catch (error) {
        console.log(error)
    }
}

const handleStar = async (req, res, stars) => {
    try {
        console.log(`Filtering products with ${stars} stars`);

        const products = await Product.aggregate([
            {
                $project: {
                    document: "$$ROOT",
                    floorAverage: {
                        $floor: { $avg: "$ratings.star" }
                    }
                }
            },
            {
                $match: { floorAverage: stars }
            }
        ])
            .limit(12)
            .exec();

        console.log('Aggregated products:', products);

        const productIds = products.map((p) => p.document._id);
        console.log('Product IDs:', productIds);

        const matchedProducts = await Product.find({ _id: { $in: productIds } })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec();

        console.log('Matched products:', matchedProducts);

        res.json(matchedProducts);
    } catch (error) {
        console.log("Aggregate Error", error);
        res.status(500).send("Server error");
    }
};

const handleSub = async (req, res, sub) => {

    const products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
    res.json(products)
}

const searchFilters = async (req, res) => {
    const { query, price, category, stars, sub } = req.body;
    if (query) {
        console.log("query----->", query)

        await handleQuery(req, res, query)
    }
    //proce[20 - 200]
    if (price !== undefined) {
        console.log("price----->", price)
        await handlePrice(req, res, price)
    }

    if (category) {
        console.log("category-----> ", category)
        await handleCategory(req, res, category)
    }

    if (stars) {
        console.log("stars-----> ", stars)
        handleStar(req, res, stars)
    }

    if (sub) {
        console.log("sub-----> ", sub)
        handleSub(req, res, sub)
    }
}

module.exports = {
    create,
    listAll,
    remove,
    read,
    update,
    list,
    productsCount,
    productStar,
    listRelated,
    searchFilters
};