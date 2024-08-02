const express = require('express')
const { createPaymentIntenet } = require('../controllers/stripe.js')
const { authCheck } = require('../middlewares/auth.js')

const router = express.Router()

router.post("/create-payment-intent", authCheck, createPaymentIntenet)


module.exports = router;