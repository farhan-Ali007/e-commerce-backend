const express = require('express');
const router = express.Router()

//import 
const { create, read, update, remove, list } = require('../controllers/category.js');



//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js")


//controllers
router.get("/categories", list)
router.get("/category/:slug", read)
router.post("/category", authCheck, adminCheck, create)
router.put("/category/:slug", authCheck, adminCheck, update)
router.delete("/category/:slug", authCheck, adminCheck, remove)



module.exports = router;