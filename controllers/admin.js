const Order = require('../models/order.js')


const orders = async (req, res) => {


    const allOrders = await Order.find({})
        .sort('-createdAt')
        .populate("products.product")
        .exec()


    res.json(allOrders)

}

const orderStatus = async (req, res) => {

    const { orderId, orderStatus } = req.body;

    const updated = await Order.findByIdAndUpdate(orderId,
        { orderStatus },
        { new: true })
        .exec()

    res.json(updated)

}


module.exports = { orders, orderStatus }