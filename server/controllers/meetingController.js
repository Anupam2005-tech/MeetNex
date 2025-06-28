const meetingModel = require("../modals/meetingSchema");
const userModel = require("../modals/userSchema");
const crypto = require("crypto");

function createroomId(length = 6) {
  const char =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%_*+~";
  const byte = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += char[byte[i] % char.length];
  }
  const date = Date.now().toString(36);
  return `${result}-${date}`;
}

async function ensureUniqueId() {
  let roomID;
  let isUnique = false;
  while (!isUnique) {
    roomID = createroomId();
    const existingRoom = await meetingModel.findOne({ room_id: roomID });
    if (!existingRoom) isUnique = true;
  }
  return roomID;
}

// meeting room create
async function createRoom(req, res) {
  try {
    const { meetingType, scheduledTime, meetingTitle } = req.body;
    const userExist = req.user._id;
    
    if (!userExist) {
      return res.status(404).json({ msg: `invalid session` });
    }

    const roomID = await ensureUniqueId();
    if (!roomID) {
      return res.status(501).json({ msg: `failed to create url` });
    }

    // Generate shareable link immediately for scheduled, null for instant
    const shareableLink = meetingType === "scheduled" 
      ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/meeting/${roomID}` 
      : null;

    // Create meeting
    const newMeeting = await meetingModel.create({
      room_id: roomID,
      hostId: userExist,
      status: "pending",
      meetingType: meetingType,
      shareableLink: shareableLink,
      startTime: scheduledTime ? new Date(scheduledTime) : undefined,
      meetingTitle: meetingTitle || `Meeting by ${req.user.name}`,
      participants: [
        {
          name: req.user.name,
          userId: userExist,
          role: "host"
        },
      ],
    });

    // Response based on meeting type
    const response = {
      roomID,
      meetingId: newMeeting._id,
    };

    // Add shareable link for scheduled meetings
    if (meetingType === "scheduled") {
      response.shareableLink = shareableLink;
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error creating room:", err);
    return res.status(500).json({ msg: "Network error or internal server error" });
  }
}


// joining logic

async function joinmeeting(req,res){
  
}

module.exports = { createRoom };
