function setupSignaling(socket, io, rooms) {
  function isValidPeer(targetSocketId) {
    const roomId = socket.data.roomId;
    if (!roomId) return false;

    const room = rooms.get(roomId);
    if (!room) return false;

    return room.peers.has(targetSocketId);
  }

  socket.on("offer", ({ to, offer }) => {
    if (!isValidPeer(to)) return;
    socket.to(to).emit("offer", { from: socket.id, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    if (!isValidPeer(to)) return;
    socket.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (!isValidPeer(to)) return;
    socket.to(to).emit("ice-candidate", {
      from: socket.id,
      candidate,
    });
  });
  
}

module.exports = { setupSignaling };
