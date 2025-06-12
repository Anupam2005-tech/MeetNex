const cookieParser=require('cookie-parser')
const {getUser}=require('../services/cookies')

function checkSession(req,res,next){
    try{
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({ msg: "Access denied: No token provided" });
        }
        const user=getUser(token)
        if(!user || !user._id || !user.email){
            return res.status(401).json({ msg: "Access denied: Invalid token" });
        }
        req.user=user
        next()
    }catch(err){
        return res.status(500).json({msg:`network error or internal server error`})
    }
}

module.exports={
    checkSession,
    cookieParser: cookieParser(),
}