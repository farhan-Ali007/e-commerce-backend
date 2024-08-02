const User = require('../models/user.js')
const Cart = require('../models/cart.js')
const Producrt = require('../models/product.js')
const Coupon = require('../models/user.js')
const stripe = require("stripe")(process.env.STRIPE_SECRET)




const createPaymentIntenet = async (req, res) => {
    //later apply coupon 
    //later calculate price


    const paymentIntent = await stripe.paymentIntents.create({
        amount: 100,
        currency: "usd"
    })

    res.send({
        clientSecret: paymentIntent.client_secret
    })

}


module.exports = { createPaymentIntenet };