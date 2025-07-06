import React, { useState, useEffect } from "react";
import RoleSelect from "./component/RoleSelect";
import FindUser from "./component/FindUser";
import FileTransfer from "./component/FileTransfer";
import { createSocket } from "./socket";

function App() {
  const [role, setRole] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connectedTo, setConnectedTo] = useState(null);

  useEffect(() => {
    const s = createSocket();
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (socket && role) socket.emit("set-role", role);
  }, [role, socket]);

  if (!socket) return <div>🔌 Connecting...</div>;
  if (!role) return <RoleSelect setRole={setRole} />;
  if (!connectedTo) return (
    <FindUser socket={socket} role={role} onConnected={setConnectedTo} />
  );
  return (
    <FileTransfer socket={socket} role={role} connectedTo={connectedTo} />
  );
}

export default App;
