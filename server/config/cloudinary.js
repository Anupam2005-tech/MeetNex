const cloudinary=require('cloudinary').v2
const dotenv=require('dotenv')

dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_CLOUD_APIKEY,
    api_secret:process.env.CLOUDINARY_CLOUD_APISECRET,
})

module.exports=cloudinary