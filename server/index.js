const express=require ('express')
const dotenv=require('dotenv')
const mongoDBconnect=require('./config/mongoDB')
const {cookieParser } = require('./middleware/middleware')
const UserAuthrouter = require('./routers/userAuthRouters')
const profileImageRouter = require('./routers/profileImageRouter')
const meetingRouter=require('./routers/meetingRouter')
const app=express()
dotenv.config()
const PORT=process.env.PORT ||3000

// middleware register
app.use(cookieParser);
app.use(express.json());

// user route register
app.use('/user',UserAuthrouter)
app.use('/profile/image',profileImageRouter)
app.use('/MeetNX',meetingRouter)

// health check
app.get('/',(req,res)=>{
return res.status(200).json('hello from server')
})

const startServer=async()=>{
    try{
        await mongoDBconnect()
        app.listen(PORT,()=>{
            console.log(`server started at ${PORT}`);
            
        })
    }catch(err){
        console.error('server failed to start');
        
    }
}

startServer()