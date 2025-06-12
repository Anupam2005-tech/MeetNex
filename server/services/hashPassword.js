const bcrypt=require('bcryptjs')
const saltRounds=10

async function hashPassword(plainPassword){
   return bcrypt.hash(plainPassword,saltRounds)
}
async function checkHashPassword(plainPassword,hash){
   return bcrypt.compare(plainPassword,hash)
}

module.exports={hashPassword,checkHashPassword}