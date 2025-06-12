const mongoose=require('mongoose')
const dotenv=require('dotenv')

dotenv.config()
const mongoURI=process.env.DATABASE_URI

mongoose.set('strictQuery',true)
async function mongoDBconnect() {
    try{
        const connection=await mongoose.connect(mongoURI,{
            connectTimeoutMS:12000
        })
        console.log('db connected');
        
    }catch(err){
        console.error('error while connecting to db');
        
    }
}
module.exports=mongoDBconnect

