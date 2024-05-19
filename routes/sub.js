const express = require('express');
const router = express.Router()

//import 
const { create, read, update, remove, list } = require('../controllers/sub.js');

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth.js")


//controllers
router.get("/subs", list)
router.get("/sub/:slug", read)
router.post("/sub", authCheck, adminCheck, create)
router.put("/sub/:slug", authCheck, adminCheck, update)
router.delete("/sub/:slug", authCheck, adminCheck, remove)



module.exports = router;