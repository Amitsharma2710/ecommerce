const cloudinary = require('../config/cloudinary')

const uploadToClodinary = async(filebuffer) =>{
    return new Promise((resolve, reject)=>{
        cloudinary.uploader.upload_stream(
            {
                folder: 'ecommerce-products'
            },
            (error, result)=>{
                if(error){
                    return reject(error)
                }
                resolve(result)
            }
        ).end(filebuffer)
    })
}

module.exports = uploadToClodinary