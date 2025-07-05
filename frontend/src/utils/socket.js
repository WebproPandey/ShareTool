import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

export default socket;
