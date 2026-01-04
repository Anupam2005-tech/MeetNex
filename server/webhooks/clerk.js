const {getAuth}=require("@clerk/express")

const verifyUser=async(req,res,next)=>{
    try{
        const auth=getAuth(req)
        const userId=auth && auth.userId
        if(!userId){
            return res.status(401).json({message:"user unauthorized"})
        }
        req.authUserId=userId
        next()
    }
    catch(err){
        console.error(err,"from clerk middleware");
        
        return err
    }

}

module.exports=verifyUser