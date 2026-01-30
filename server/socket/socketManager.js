// socket/socketManager.js
const { setupSignaling } = require("./signaling");
const { setupChatHandlers } = require("./chat");
const { scheduleRoomCleanup, cancelRoomCleanup } = require("../utils/roomCleanup");

function initSocketManager(io) {
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // ✅ Setup Chat Handlers
    setupChatHandlers(io, socket);

    socket.on("join-room", ({ roomId, userId, userProfile }, callback) => {
      // 🛑 Cancel any pending cleanup since a user is joining/rejoining
      cancelRoomCleanup(roomId);

      socket.join(roomId);
      socket.userId = userId;
      socket.roomId = roomId;
      socket.userProfile = userProfile; // ✅ Store User Profile

      const roomUsers = io.sockets.adapter.rooms.get(roomId);
      const userCount = roomUsers ? roomUsers.size : 0;

      console.log(`👥 User ${userId} (${socket.id}) joined room ${roomId}. Total: ${userCount}`);

      // ✅ Broadcast to others in the room
      socket.to(roomId).emit("user-joined", { 
        userId, 
        userProfile 
      });

      // ✅ CRITICAL FIX: Get the actual socket IDs from the room
      if (userCount === 2) {
        const socketsInRoom = Array.from(roomUsers || []);
        console.log(`📊 Sockets in room:`, socketsInRoom);

        if (socketsInRoom.length === 2) {
          const [initiatorSocketId, responderSocketId] = socketsInRoom;
          
          const initiatorSocket = io.sockets.sockets.get(initiatorSocketId);
          const responderSocket = io.sockets.sockets.get(responderSocketId);

          // ✅ FIRST peer (already in room) is initiator
          console.log(`[READY] Emitting ready to INITIATOR: ${initiatorSocketId}`);
          io.to(initiatorSocketId).emit("ready", {
            peerId: responderSocketId,
            peerProfile: responderSocket?.userProfile, // ✅ Send Profile
            initiator: true, 
          });

          console.log(`🚀 Initiator: ${initiatorSocketId} → Responder: ${responderSocketId}`);

          // ✅ SECOND peer (just joined) waits for offer
          console.log(`[READY] Emitting ready to RESPONDER: ${responderSocketId}`);
          io.to(responderSocketId).emit("ready", {
            peerId: initiatorSocketId,
            peerProfile: initiatorSocket?.userProfile, // ✅ Send Profile
            initiator: false, 
          });

          console.log(`🎯 Responder ready to receive offer`);
        }
      } else if (userCount === 1) {
        // First user joined, waiting for second
        console.log(`⏳ Waiting for second peer...`);
      }

      callback?.({ success: true });
    });

    socket.on("leaveRoom", () => {
      const roomId = socket.roomId;
      if (roomId) {
        socket.to(roomId).emit("userLeft", { peerId: socket.id });
        socket.leave(roomId);
        console.log(`👋 ${socket.id} left ${roomId}`);

        // ⏳ Check if room is empty -> Schedule cleanup
        const roomUsers = io.sockets.adapter.rooms.get(roomId);
        if (!roomUsers || roomUsers.size === 0) {
           scheduleRoomCleanup(roomId);
        }
      }
    });

    socket.on("disconnect", () => {
      const roomId = socket.roomId;
      if (roomId) {
        io.to(roomId).emit("peerDisconnected", { peerId: socket.id });

        // ⏳ Check if room is empty -> Schedule cleanup
        const roomUsers = io.sockets.adapter.rooms.get(roomId);
        if (!roomUsers || roomUsers.size === 0) {
           scheduleRoomCleanup(roomId);
        }
      }
      console.log(`❌ ${socket.id} disconnected`);
    });
  });

  // ✅ Setup signaling handlers
  setupSignaling(io);
}

module.exports = { initSocketManager };
