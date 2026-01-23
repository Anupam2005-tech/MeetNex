const { setupSignaling } = require("./signaling");
const { setupChatHandlers } = require("./chat");
const MeetingModel = require("../models/meetingModal");

const rooms = new Map(); 

function initSocketManager(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /* =========================
       JOIN ROOM
    ========================= */
    socket.on("join-room", async ({ roomId }) => {
      try {
        const userId = socket.data.userId;
        if (!roomId || !userId) {
          socket.emit("error", "Invalid join request");
          return;
        }

        // Verify meeting
        const meeting = await MeetingModel.findOne({ roomId });
        if (!meeting) {
          socket.emit("error", "Meeting not found");
          return;
        }

        // Verify REST join happened
        if (!meeting.participants.includes(userId)) {
          socket.emit("error", "Not allowed to join meeting");
          return;
        }

        // Enforce P2P limit
        if (meeting.type === "P2P") {
          const room = rooms.get(roomId);
          if (room && room.peers.size >= 2) {
            socket.emit("error", "P2P room already full");
            return;
          }
        }

        let room = rooms.get(roomId);
        if (!room) {
          room = {
            hostId: meeting.hostId,
            peers: new Map(),
          };
          rooms.set(roomId, room);
        }

        socket.join(roomId);
        socket.data.roomId = roomId;

        room.peers.set(socket.id, userId);

        // Existing peers
        const existingPeers = [...room.peers.entries()]
          .filter(([sid]) => sid !== socket.id)
          .map(([socketId, userId]) => ({ socketId, userId }));

        socket.emit("existing-peers", existingPeers);

        socket.to(roomId).emit("user-joined", {
          socketId: socket.id,
          userId,
        });

        console.log(`User ${userId} joined room ${roomId}`);
      } catch (err) {
        console.error("Join-room error:", err);
        socket.emit("error", "Join failed");
      }
    });

    /* =========================
       SIGNALING
    ========================= */
    setupSignaling(socket, io, rooms);

    /* =========================
       CHAT
    ========================= */
    setupChatHandlers(io, socket);

    /* =========================
       DISCONNECT
    ========================= */
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      const userId = socket.data.userId;
      if (!roomId) return;

      const room = rooms.get(roomId);
      if (!room) return;

      room.peers.delete(socket.id);

      socket.to(roomId).emit("user-left", {
        socketId: socket.id,
        userId,
      });

      // Host reassignment
      if (room.hostId === userId) {
        const nextHost =
          room.peers.size > 0
            ? [...room.peers.values()][0]
            : null;

        room.hostId = nextHost;
        io.to(roomId).emit("host-changed", { hostId: nextHost });
      }

      if (room.peers.size === 0) {
        rooms.delete(roomId);
        console.log("Room deleted:", roomId);
      }

      console.log("Socket disconnected:", socket.id);
    });
  });
}

module.exports = { initSocketManager };
