const express = require('express')
const router = express.Router()


//Middlewares
const { authCheck, adminCheck } = require('../middlewares/auth.js')

//controllers


const { uploads, remove } = require('../controllers/cloudinary.js')

//routes

router.post("/uploadimages", authCheck, adminCheck, uploads)
router.post("/removeimages", authCheck, adminCheck, remove)



module.exports = router;