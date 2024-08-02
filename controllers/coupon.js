const Coupon = require('../models/coupon.js')

const create = async (req, res) => {

    try {
        const { name, expiry, discount } = req.body.coupon;
        const coupon = await new Coupon({ name, expiry, discount }).save()

        res.json(coupon)


    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create coupon"
        });

    }

}

const list = async (req, res) => {

    try {
        const coupon = await Coupon.find({})
            .sort({ createdAt: -1 })
            .exec()

        res.json(coupon)
    } catch (error) {
        console.log(error)
    }

}

const remove = async (req, res) => {

    try {

        const coupon = await Coupon.findByIdAndDelete(req.params.couponId).exec()
        res.json(coupon)

    } catch (error) {
        console.log(error)
    }

}

module.exports = { create, list, remove }