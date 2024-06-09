const express = require('express');
const router = express.Router()

//import 
const { create, listAll, remove, read, update , list, productsCount } = require('../controllers/product.js');



//middlewares
const { authCheck, adminCheck, } = require("../middlewares/auth.js")


//controllers
router.post("/product", authCheck, adminCheck, create)
router.get("/products/total" ,productsCount )
router.get("/products/:count", listAll)
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.post("/products" , list)





module.exports = router;