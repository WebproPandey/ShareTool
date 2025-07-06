let users = {}; // { socketId: { id, role } }

function clearSocket(socket, io) {
  if (users[socket.id]) {
    delete users[socket.id];
    io.emit("users", Object.values(users));
    console.log("🧹 Cleared:", socket.id);
  }
}

export function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    socket.on("set-role", (role) => {
      users[socket.id] = { id: socket.id, role };
      io.emit("users", Object.values(users));
      console.log(`👤 ${socket.id} is now a ${role}`);
    });

    socket.on("request-connection", ({ to }) => {
      io.to(to).emit("connection-request", { from: socket.id });
      console.log(`📨 ${socket.id} → request to ${to}`);
    });

    socket.on("accept-connection", ({ to }) => {
      io.to(to).emit("connection-accepted", { from: socket.id });
      console.log(`✅ ${socket.id} accepted ${to}`);
    });

    socket.on("send-file", ({ to, fileName, fileData }) => {
      io.to(to).emit("receive-file", { fileName, fileData });
      console.log(`📤 ${socket.id} → ${to} file: ${fileName}`);
    });

    socket.on("disconnect", () => clearSocket(socket, io));
  });
}
