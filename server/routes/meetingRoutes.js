// routes/meetingRoutes.js
const { Router } = require("express");
const verifyUser = require("../middleware/verifyUserMiddleware");
const { createRoom, joinRoom } = require("../controllers/roomController");

const router = Router();

router.post("/create", verifyUser, createRoom);
router.post("/join", verifyUser, joinRoom);

module.exports = router;
