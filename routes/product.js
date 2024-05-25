const express = require('express');
const router = express.Router()

//import 
const { create, listAll } = require('../controllers/product.js');



//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js")


//controllers
router.post("/product", authCheck, adminCheck, create)
router.get("/products/:count", listAll)




module.exports = router;