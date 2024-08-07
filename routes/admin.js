const express = require('express')
const { authCheck, adminCheck } = require('../middlewares/auth.js');
const { orders, orderStatus } = require('../controllers/admin.js')


const router = express.Router()

router.get("/admin/orders", authCheck, adminCheck, orders) // get all orders
router.put("/admin/order-status", authCheck, adminCheck, orderStatus) //update order status


module.exports = router;