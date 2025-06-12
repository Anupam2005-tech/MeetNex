const express = require("express");
const {checkSession}=require('../middleware/middleware')
const {
  userRegister,
  userLogin,
  userUpdate,
  userDelete,
  userLogout,
  usercheckAuth,
} = require("../controllers/userAuthController");

const UserAuthrouter = express.Router();

// public routes
UserAuthrouter.post("/register", userRegister);
UserAuthrouter.post("/login", userLogin);

// protected routes
UserAuthrouter.delete("/delete", checkSession,userDelete);
UserAuthrouter.put("/update",checkSession, userUpdate);
UserAuthrouter.get("/logout",checkSession, userLogout);
UserAuthrouter.get("/checkauth", usercheckAuth);


module.exports=UserAuthrouter