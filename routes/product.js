const express = require('express');
const router = express.Router()

//import 
const { create, read } = require('../controllers/product.js');



//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js")


//controllers
router.post("/product", authCheck, adminCheck, create)
router.get("/products", read)




module.exports = router;