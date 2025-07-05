export function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`🟢 ${socket.id} joined room: ${roomId}`);
    });

    socket.on("signal", ({ to, signal }) => {
      // Fix: use 'signal' instead of 'data' for consistency with frontend
      console.log(`📡 Relaying signal from ${socket.id} to ${to}`);
      io.to(to).emit("signal", {
        from: socket.id,
        signal
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
}
