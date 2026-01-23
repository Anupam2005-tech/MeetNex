const MeetingModel = require("../models/meetingModal");

const generateRoomId = () => {
  const num = Math.floor(100 + Math.random() * 900);
  const str = Math.random().toString(36).substring(2, 8);
  return `MeetNex-${num}-${str}`;
};

const createRoom = async (req, res) => {
  try {
    const hostId = req.authUserId;
    let { type, visibility, allowedUsers } = req.body;

    // Defaults
    type = type === "SFU" ? "SFU" : "P2P";
    visibility = visibility === "OPEN" ? "OPEN" : "PRIVATE";
    allowedUsers = Array.isArray(allowedUsers) ? allowedUsers : [];

    const roomId = generateRoomId();

    const meeting = await MeetingModel.create({
      roomId,
      hostId,
      type,
      visibility,
      allowedUsers:
        visibility === "PRIVATE"
          ? [...new Set([hostId, ...allowedUsers])]
          : [],
      maxParticipants: type === "P2P" ? 2 : 50,
      participants: [hostId],
      status: "CREATED",
    });

    return res.status(201).json({
      message: "Meeting created",
      roomId: meeting.roomId,
      type: meeting.type,
      visibility: meeting.visibility,
    });
  } catch (err) {
    console.error("Create room error:", err);
    return res.status(500).json({ message: "Failed to create meeting" });
  }
};

const joinRoom = async (req, res) => {
  try {
    const userId = req.authUserId;
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "roomId required" });
    }

    const meeting = await MeetingModel.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({ message: "Room not found" });
    }

    //  Ended meeting
    if (meeting.status === "ENDED") {
      return res.status(403).json({ message: "Meeting has ended" });
    }

    //  Private access
    if (
      meeting.visibility === "PRIVATE" &&
      !meeting.allowedUsers.includes(userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    //  Already joined
    if (meeting.participants.includes(userId)) {
      return res.status(200).json({
        message: "Already joined",
        roomId: meeting.roomId,
        type: meeting.type,
      });
    }

    //  Capacity check
    if (meeting.participants.length >= meeting.maxParticipants) {
      return res.status(403).json({ message: "Meeting is full" });
    }

    // ✅Join
    meeting.participants.push(userId);

    //  Status update
    if (meeting.participants.length >= 2) {
      meeting.status = "LIVE";
    }

    await meeting.save();

    return res.status(200).json({
      message: "Joined meeting",
      roomId: meeting.roomId,
      type: meeting.type,
    });
  } catch (err) {
    console.error("Join room error:", err);
    return res.status(500).json({ message: "Join failed" });
  }
};

module.exports = { createRoom ,joinRoom};
