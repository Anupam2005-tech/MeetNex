const MeetingModel = require('../models/meetingModal');

const generateRoomId = () => {
  const num = Math.floor(100 + Math.random() * 900);
  const str = Math.random().toString(36).substring(2, 8);
  return `MeetNex-${num}-${str}`;
}

const createRoom = async (req, res) => {
    try {
        const roomId = generateRoomId(); 
        const hostId = req.authUserId;

        await MeetingModel.create({
            roomId,
            hostId,
            participantsId: [hostId]
        });

        return res.status(201).json({ 
            message: "Meeting created successfully", 
            roomId 
        });
    } catch(err) {
        console.error("Error creating room:", err);
        return res.status(500).json({ message: "Error occurred while creating the room" });
    }
}

const joinRoom = async (req, res) => {
    try {
        const verifyUser = req.authUserId;
        const { roomId } = req.body; 

        if (!verifyUser) {
            return res.status(401).json({ message: "User unauthenticated" });
        }
        
        const meeting = await MeetingModel.findOneAndUpdate(
            { roomId: roomId },
            { $addToSet: { participantsId: verifyUser } },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ message: "Meeting room not found" });
        }
        
        return res.status(200).json({ message: "Joined successfully", meeting });

    } catch (err) {
        console.error("Error joining room:", err);
        return res.status(500).json({ message: "Internal error occurred" });
    }
}

module.exports = { createRoom, joinRoom };