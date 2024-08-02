const User = require('../models/user.js')
const Cart = require('../models/cart.js')
const Producrt = require('../models/product.js')
const Coupon = require('../models/user.js')
const stripe = require("stripe")(process.env.STRIPE_SECRET)




const createPaymentIntenet = async (req, res) => {
    // console.log(req.body);

    const { couponApplied } = req.body;

    //later apply coupon 
    //later calculate price

    //1 find the user


    const user = await User.findOne({ email: req.user.email }).exec()

    //2 get the use cart total

    const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderdBy: user._id }).exec()
    // console.log("Cart total--->", cartTotal, "Cart total after discount---->", totalAfterDiscount)


    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {

        finalAmount = (totalAfterDiscount * 100)
    } else {
        finalAmount = (cartTotal * 100)
    }

    // console.log("Cart total charged ====>", cartTotal)

    //3 create payment intent with other amount and currency

    const paymentIntent = await stripe.paymentIntents.create({
        amount: cartTotal * 100,
        currency: "usd",
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount
    })

}


module.exports = { createPaymentIntenet };