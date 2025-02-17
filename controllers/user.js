const User = require('../models/user.js')
const Product = require('../models/product.js')
const Cart = require('../models/cart.js');
const Coupon = require('../models/coupon.js')
const Order = require('../models/order.js')
const { v4: uuidv4 } = require('uuid');


const userCart = async (req, res) => {
    // console.log(req.body);

    const { cart } = req.body;

    let products = [];

    const user = await User.findOne({ email: req.user.email }).exec()

    //check if the cart with logged-in user id already exists

    let cartExixtByThisUser = await Cart.findOne({ orderdBy: user._id }).exec()

    if (cartExixtByThisUser) {
        cartExixtByThisUser.remove()
        // console.log("Removed old cart")
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {}


        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color

        //get price for getting total

        let productFromDb = await Product.findById(cart[i]._id).select("price").exec()
        object.price = productFromDb.price;

        products.push(object)
    }

    // console.log("Products--->", products)

    let cartTotal = 0;

    for (i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
    }

    // console.log("Cart total------->", cartTotal)

    let newCart = await new Cart({
        products,
        cartTotal,
        orderdBy: user._id,
    }).save()

    // console.log("New Cart---->", newCart)

    res.json({ ok: true })
};

const getUserCart = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();

        const cart = await Cart.findOne({ orderdBy: user._id })
            .populate('products.product', '_id price title')
            .exec();

        if (!cart) {
            return res.json({ products: [], cartTotal: 0, totalAfterDiscount: 0 });
        }

        const { products, cartTotal, totalAfterDiscount } = cart;

        res.json({ cartTotal, products, totalAfterDiscount });
    } catch (err) {
        console.error("Error in getUserCart:", err);
        res.status(500).json({ error: "An error occurred while retrieving the cart." });
    }
};

const emptyCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec()
    const cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec()

    res.json(cart)
};

const saveAddress = async (req, res) => {
    const userAddress = User.findOneAndUpdate(
        { email: req.user.email },
        { address: req.body.address }
    ).exec()

    res.json({ ok: true })
};

const applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;
    // console.log("Coming Coupon--->", req.body);

    const validCoupon = await Coupon.findOne({ name: coupon }).exec()

    if (validCoupon === null) {
        return res.json({
            err: "Invalid coupon"
        })
    }

    // console.log("Valid coupon--->", validCoupon)

    const user = await User.findOne({ email: req.user.email }).exec()

    let { products, cartTotal } = await Cart.findOne({ orderdBy: user._id })
        .populate("products.product", "_id title price")
        .exec()

    // console.log("cart total", cartTotal, "Dicount %", validCoupon.discount)

    //calculate the total after discount

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2) // 45.4567456  = 45

    Cart.findOneAndUpdate({ orderdBy: user._id }, { totalAfterDiscount }, { new: true }).exec();

    res.json(totalAfterDiscount)

};

const createOrder = async (req, res) => {

    const { paymentIntent } = req.body.stripeResponse;
    const user = await User.findOne({ email: req.user.email }).exec();

    let { products } = await Cart.findOne({ orderdBy: user._id }).exec();


    let newOrder = await new Order({
        products,
        paymentIntent,
        orderdBy: user._id
    }).save();

    //increment sold and decrement quantity
    //using a mongodb method called bulkwrite method

    let bulkOptions = products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },    //important item.product._id (each item is an array that has multiple products )
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    })
    let updated = await Product.bulkWrite(bulkOptions, {})
    console.log("Updated (quantity-- and sold++)=====>", updated)

    console.log("New Order saved ====>", newOrder)
    res.json({ ok: true })

};

const orders = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec()

    let userOrders = await Order.find({ orderdBy: user._id })
        .populate("products.product")
        .exec()

    res.json(userOrders)
};

const addToWishlist = async (req, res) => {

    const { productId } = req.body;

    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $addToSet: { wishlist: productId } },
        { new: true }
    ).exec()
    res.json({ ok: true })

};

const wishlist = async (req, res) => {

    const list = await User.findOne({ email: req.user.email })
        .select('wishlist')
        .populate('wishlist')
        .exec()

    res.json(list)

};

const removeFromWishlist = async (req, res) => {

    const { productId } = req.params;

    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { wishlist: productId } },)
        .exec()

    res.json({ ok: true })
};

const createCashOrder = async (req, res) => {

    const { COD, couponApplied } = req.body;
    // if COD is true, create order with status of Cash On Delivery

    if (!COD) return res.status(400).send("Create cash order failed");

    const user = await User.findOne({ email: req.user.email }).exec();

    let userCart = await Cart.findOne({ orderdBy: user._id }).exec();

    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100;
    } else {
        finalAmount = userCart.cartTotal * 100;
    }

    let newOrder = await new Order({
        products: userCart.products,
        paymentIntent: {
            id: uuidv4(),
            amount: finalAmount,
            currency: "usd",
            status: "Cash On Delivery",
            created: Date.now(),
            payment_method_types: ["cash"],
        },
        orderdBy: user._id,
        orderStatus: "Cash On Delivery",
    }).save();

    // decrement quantity, increment sold
    let bulkOption = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id }, // IMPORTANT item.product
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    // console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

    // console.log("NEW ORDER SAVED", newOrder);
    res.json({ ok: true });
};


module.exports = {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCouponToUserCart,
    createOrder,
    orders,
    addToWishlist,
    wishlist,
    removeFromWishlist,
    createCashOrder
}