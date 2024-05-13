const express = require('express')


const router = express.Router()


router.get('/user', (req, res) => {
    res.json({
        data: "Hey you hit the user Api EndPoint"
    })
})


module.exports = router;