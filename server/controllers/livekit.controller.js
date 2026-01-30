const { AccessToken } = require('livekit-server-sdk');
const MeetingModel = require("../models/meetingModal"); // Added DB Model
require('dotenv').config();

const createToken = async (req, res) => {
  const { roomName, participantName, identity } = req.body;

  if (!roomName || !participantName || !identity) {
    return res.status(400).json({ error: 'Missing required fields: roomName, participantName, identity' });
  }

  // Use environment variables for API key and secret
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error("Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET");
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  try {
    // --- STAGE 1: DB VERIFICATION ---
    const meeting = await MeetingModel.findOne({ roomId: roomName });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting room not found in database. Please join via the correct link.' });
    }

    if (meeting.status === 'ENDED') {
      return res.status(403).json({ error: 'Meeting has ended.' });
    }

    // Check capacity (Strict 1v1 / Max Limit)
    // Note: This check relies on DB state. LiveKit's actual room state might be more accurate for real-time,
    // but this prevents dispensing tokens for "known full" rooms.
    // We explicitly allow the user if they are ALREADY in the participants list (re-joining).
    const isReturningUser = meeting.participants.includes(identity) || meeting.participants.includes(req.authUserId); // identity often == userId in this app logic or is mapped
    
    // Logic: If not a returning user AND room is full -> Reject
    if (!isReturningUser && meeting.participants.length >= meeting.maxParticipants) {
       return res.status(403).json({ error: 'Meeting is full. Maximum participants reached.' });
    }
    
    // --- STAGE 2: TOKEN GENERATION ---
    const isHost = meeting.hostId === identity;

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: participantName,
      metadata: JSON.stringify({ isHost, image: req.body.image }),
    });

    at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
};

module.exports = { createToken };
