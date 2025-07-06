let users = {}; // { socketId: { id, role } }

function clearSocket(socket, io) {
  try {
    if (users[socket.id]) {
      delete users[socket.id];
      io.emit("users", Object.values(users));
      console.log("🧹 Cleared:", socket.id);
    }
  } catch (err) {
    console.error("[clearSocket error]", err);
  }
}

export function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    socket.on("set-role", (role) => {
      try {
        users[socket.id] = { id: socket.id, role };
        io.emit("users", Object.values(users));
        console.log(`👤 ${socket.id} is now a ${role}`);
      } catch (err) {
        console.error("[set-role error]", err);
      }
    });

    socket.on("request-connection", ({ to }) => {
      try {
        io.to(to).emit("connection-request", { from: socket.id });
        console.log(`📨 ${socket.id} → request to ${to}`);
      } catch (err) {
        console.error("[request-connection error]", err);
      }
    });

    socket.on("accept-connection", ({ to }) => {
      try {
        io.to(to).emit("connection-accepted", { from: socket.id });
        console.log(`✅ ${socket.id} accepted ${to}`);
      } catch (err) {
        console.error("[accept-connection error]", err);
      }
    });

    socket.on("send-file", ({ to, fileName, fileData }) => {
      try {
        io.to(to).emit("receive-file", { fileName, fileData });
        console.log(`📤 ${socket.id} → ${to} file: ${fileName}`);
      } catch (err) {
        console.error("[send-file error]", err);
      }
    });

    socket.on("disconnect", (reason) => {
      try {
        clearSocket(socket, io);
        console.log(`🔌 Disconnected: ${socket.id}, reason: ${reason}`);
      } catch (err) {
        console.error("[disconnect error]", err);
      }
    });

    socket.on("error", (err) => {
      console.error(`[Socket error] ${socket.id}:`, err);
    });
  });
}
