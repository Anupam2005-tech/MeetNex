const ChatMessage = require("../models/ChatMessage");

const typingUsers = new Map();

function setupChatHandlers(io, socket) {
  /* =========================
      SEND MESSAGE
  ========================= */
  socket.on("chat:send", async ({ roomId, message }) => {
    if (!roomId || !message?.trim()) return;

    const payload = {
      roomId,
      senderId: socket.data.userId,
      message: message.trim(),
    };

    // Persist message
    const saved = await ChatMessage.create(payload);

    // Broadcast
    io.to(roomId).emit("chat:new", {
      _id: saved._id,
      roomId,
      senderId: payload.senderId,
      message: payload.message,
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
    if (users.has(socket.data.userId)) return;

    users.add(socket.data.userId);

    socket.to(roomId).emit("chat:typing", {
      userId: socket.data.userId,
      isTyping: true,
    });

    // auto-expire (failsafe)
    setTimeout(() => {
      if (users.delete(socket.data.userId)) {
        socket.to(roomId).emit("chat:typing", {
          userId: socket.data.userId,
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

    if (users.delete(socket.data.userId)) {
      socket.to(roomId).emit("chat:typing", {
        userId: socket.data.userId,
        isTyping: false,
      });
    }
  });

  /* =========================
      CLEANUP
  ========================= */
  socket.on("disconnect", () => {
    for (const [roomId, users] of typingUsers.entries()) {
      if (users.delete(socket.data.userId)) {
        socket.to(roomId).emit("chat:typing", {
          userId: socket.data.userId,
          isTyping: false,
        });
      }
    }
  });
}

module.exports = { setupChatHandlers };
