const express=require('express')
const {checkSession}=require('../middleware/middleware')
const {createRoom}=require('../controllers/meetingController')
const meetingRouter=express.Router()

// start instant meeting
meetingRouter.post('/instant/meeting',checkSession,createRoom)
// // sharable meeting
// meetingRouter.post('/share/meeting')
// meetingRouter.post('/join/meeting',checkSession)
// meetingRouter.get('/meeting/history',checkSession)
// meetingRouter.delete('/meeting/delete',checkSession)

module.exports=meetingRouter