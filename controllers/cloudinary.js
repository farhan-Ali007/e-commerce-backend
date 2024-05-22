const cloudinary = require('cloudinary').v2


//config

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploads = async (req, res) => {

    let result = await cloudinary.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: 'auto'
    })
    res.json({
        public_id: result.public_id,
        url: (await result).secure_url,

    })

}
const remove = (req, res) => {
    let image_id = req.body.public_id;

    cloudinary.uploader.destroy(image_id, (err, res) => {
        if (err) return res.json({ success: false, err });

        res.send("ok")
    })

}

module.exports = { uploads, remove }