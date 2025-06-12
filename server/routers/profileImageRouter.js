const express = require("express");
const {checkSession}=require('../middleware/middleware')
const {
  uploadprofieImage,
  getprofileImage,
  deleteprofileImage,
  updateprofileImage,
} = require("../controllers/profileImageController");

const profileImageRouter = express.Router();

profileImageRouter.post('/upload',checkSession,uploadprofieImage)
profileImageRouter.get('/get',checkSession,getprofileImage)
profileImageRouter.delete('/delete',checkSession,deleteprofileImage)
profileImageRouter.put('/update',checkSession,updateprofileImage)

module.exports=profileImageRouter
