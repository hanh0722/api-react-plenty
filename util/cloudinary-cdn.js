const cloudinary = require('cloudinary').v2;
const cloudinaryUpload = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (err, res) => {
            if(err){
                return res.status(500).json('Cannot upload image');
            }
            resolve({
                res: res.secure_url
            })
        })
    })
}

module.exports = cloudinaryUpload;