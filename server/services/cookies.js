const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()
const SECRET_ID=process.env.SECRET_ID
function setUser(user){
    if (!user || !user._id || !user.email) {
        throw  new Error("Invalid user ");
      }
    return jwt.sign({
        _id:user._id,
        email:user.email
    }
,SECRET_ID,{expiresIn:'48h'})
}

function getUser(token){
if(!token){
    return null
}
try{
   return jwt.verify(token,SECRET_ID)
}
catch(err){
    console.error(err);
    return null;
  }
}

module.exports={
    setUser,getUser
}