const express = require('express')
const { authCheck } = require('../middlewares/auth.js');
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCouponToUserCart,
    createOrder,
    orders
} = require('../controllers/user.js');


const router = express.Router()


router.post("/user/cart", authCheck, userCart) //save cart
router.get("/user/cart", authCheck, getUserCart) // get user cart
router.delete("/user/cart", authCheck, emptyCart) // empty cart
router.post("/user/address", authCheck, saveAddress) // Save address


router.post("/user/cart/coupon", authCheck, applyCouponToUserCart) // Save address
//order section

router.post("/user/order", authCheck, createOrder)
router.get("/user/orders", authCheck, orders)

// router.get('/user', (req, res) => {
//     res.json({
//         data: "Hey you hit the user Api EndPoint"
//     })
// })





module.exports = router;