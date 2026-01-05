const { Router } = require("express");
const verifyUser = require("../middleware/auth"); 
const { createRoom, joinRoom } = require("../controllers/roomController"); 

const MeetingRoutes = Router();
MeetingRoutes.post("/create", verifyUser, createRoom);
MeetingRoutes.post("/join", verifyUser, joinRoom);

module.exports = MeetingRoutes;