// socket/signaling.js
function setupSignaling(io) {
  const socketToRoom = new Map();

  io.on("connection", (socket) => {
    // ✅ Handle offer
    socket.on("offer", ({ to, offer }) => {
      console.log(`📤 Offer from ${socket.id} to ${to}`);
      io.to(to).emit("offer", {
        from: socket.id,
        offer,
      });
    });

    // ✅ Handle answer
    socket.on("answer", ({ to, answer }) => {
      console.log(`📤 Answer from ${socket.id} to ${to}`);
      io.to(to).emit("answer", {
        from: socket.id,
        answer,
      });
    });

    // ✅ Handle ICE candidates
    socket.on("ice-candidate", ({ to, candidate }) => {
      console.log(`🧊 ICE candidate from ${socket.id} to ${to}`);
      io.to(to).emit("ice-candidate", {
        from: socket.id,
        candidate,
      });
    });

    // ✅ Handle screen sharing started
    socket.on("screen-share-started", ({ to }) => {
      console.log(`📺 Screen share started by ${socket.id} to ${to}`);
      io.to(to).emit("screen-share-started", {
        from: socket.id,
      });
    });

    // ✅ Handle screen sharing stopped
    socket.on("screen-share-stopped", ({ to }) => {
      console.log(`📺 Screen share stopped by ${socket.id} to ${to}`);
      io.to(to).emit("screen-share-stopped", {
        from: socket.id,
      });
    });
  });
}

module.exports = { setupSignaling };
