const express = require('express')
const router = express.Router()


//Middlewares
const { authCheck, adminCheck } = require('../middlewares/auth.js')

//controllers


const { uploads, remove } = require('../controllers/cloudinary.js')

//routes

router.post("/uploadImages", authCheck, adminCheck, uploads)
router.post("/removeImages", authCheck, adminCheck, remove)



module.exports = router;