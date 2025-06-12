const multer=require('multer')
const cloudinary=require('./cloudinary')
const {CloudinaryStorage}=require('multer-storage-cloudinary')

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    
        params:{
            folder:"MeetNX_userData",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            transformation: [{ width: 300, height: 300, crop: "fill" ,radius:"max" , fetch_format: "auto", quality: "auto" }],
        }
    
})

const upload=multer({storage})

module.exports=upload