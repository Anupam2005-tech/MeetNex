const { clerkClient } = require("@clerk/express");

function setupSocketAuth(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));

      const session = await clerkClient.sessions.verifySession(token);
      socket.data.userId = session.userId;

      next();
    } catch (err) {
      console.error("Socket auth failed:", err);
      next(new Error("Unauthorized"));
    }
  });
}

module.exports = { setupSocketAuth };
