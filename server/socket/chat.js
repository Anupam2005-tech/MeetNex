const ChatMessage = require("../models/ChatMessage");

const typingUsers = new Map();

function setupChatHandlers(io, socket) {
  /* =========================
      SEND MESSAGE
  ========================= */
  socket.on("chat:send", async ({ roomId, message, attachment }) => {
    if (!roomId) return;
    if (!message && !attachment) return; // Allow empty message if there's an attachment

    // EPHEMERAL FILE HANDLING (No DB Storage)
    if (attachment && attachment.data) {
        // Broadcast directly to room (Relay only)
        io.to(roomId).emit("chat:new", {
            _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            roomId,
            senderId: socket.userId,
            senderName: socket.userProfile?.fullName || "Unknown",
            senderImage: socket.userProfile?.imageUrl,
            message: message ? message.trim() : "",
            attachment: attachment, // Contains { name, type, data, url? }
            createdAt: new Date(),
        });
        return; // Skip DB save
    }

    const payload = {
      roomId,
      senderId: socket.userId,
      message: message ? message.trim() : "",
      attachment: attachment || null,
    };

    // Persist message
    const saved = await ChatMessage.create(payload);

    // Broadcast
    io.to(roomId).emit("chat:new", {
      _id: saved._id,
      roomId,
      senderId: payload.senderId,
      senderName: socket.userProfile?.fullName || "Unknown",
      senderImage: socket.userProfile?.imageUrl,
      message: payload.message,
      attachment: payload.attachment,
      createdAt: saved.createdAt,
    });
  });

  /* =========================
      TYPING START
  ========================= */
  socket.on("chat:typing:start", ({ roomId }) => {
    if (!roomId) return;

    if (!typingUsers.has(roomId)) {
      typingUsers.set(roomId, new Set());
    }

    const users = typingUsers.get(roomId);
    if (users.has(socket.userId)) return;

    users.add(socket.userId);

    socket.to(roomId).emit("chat:typing", {
      userId: socket.userId,
      isTyping: true,
    });

    // auto-expire (failsafe)
    setTimeout(() => {
      if (users.delete(socket.userId)) {
        socket.to(roomId).emit("chat:typing", {
          userId: socket.userId,
          isTyping: false,
        });
      }
    }, 5000);
  });

  /* =========================
      TYPING STOP
  ========================= */
  socket.on("chat:typing:stop", ({ roomId }) => {
    const users = typingUsers.get(roomId);
    if (!users) return;

    if (users.delete(socket.userId)) {
      socket.to(roomId).emit("chat:typing", {
        userId: socket.userId,
        isTyping: false,
      });
    }
  });

  /* =========================
      CLEANUP
  ========================= */
  socket.on("disconnect", () => {
    for (const [roomId, users] of typingUsers.entries()) {
      if (users.delete(socket.userId)) {
        socket.to(roomId).emit("chat:typing", {
          userId: socket.userId,
          isTyping: false,
        });
      }
    }
  });
}

module.exports = { setupChatHandlers };
