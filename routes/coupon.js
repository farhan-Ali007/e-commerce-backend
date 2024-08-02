const express = require('express');
const router = express.Router()

//import 
const { create, remove, list } = require('../controllers/coupon.js');

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js")


//controllers
router.post("/coupon", create)
router.get("/coupons", authCheck, adminCheck, list)
router.delete("/coupon/:couponId", authCheck, adminCheck, remove)



module.exports = router;