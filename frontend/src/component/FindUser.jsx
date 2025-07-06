// ✅ FILE: src/components/FindUser.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function FindUser({ onConnected, socket }) {
  const radarRef = useRef(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState(null);
  const [users, setUsers] = useState([]);
  const [connectedTo, setConnectedTo] = useState(null);
  const [incomingRequest, setIncomingRequest] = useState(null);

  useEffect(() => {
    radarRef.current?.classList.add("animate-spin-slow");
  }, []);

  console.log(socket)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId(null);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("users", (usersList) => {
      const filtered = usersList.filter(u => u.id !== socket.id);
      setUsers(filtered);

      if (connectedTo && !filtered.find(u => u.id === connectedTo)) {
        setConnectedTo(null);
        setIncomingRequest(null);
        alert("⚠️ Connected user has disconnected.");
      }
    });

    socket.on("connection-request", ({ from }) => {
      setIncomingRequest(from);
    });

    socket.on("connection-accepted", ({ from }) => {
      setConnectedTo(from);
      onConnected(from); // <- important line to notify App.jsx
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("users");
      socket.off("connection-request");
      socket.off("connection-accepted");
    };
  }, [connectedTo, onConnected, socket]);

  const handleRequestConnect = (to) => {
    socket.emit("request-connection", { to });
  };

  const handleAcceptConnection = () => {
    socket.emit("accept-connection", { to: incomingRequest });
    setConnectedTo(incomingRequest);
    setIncomingRequest(null);
    onConnected(incomingRequest); // <- another important line
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white px-4">
      <h2 className="text-lg font-medium mb-6">Searching for receivers</h2>

      <div className="relative w-72 h-72 mb-6">
        <div className="absolute w-full h-full rounded-full border-2 border-blue-400" />
        <div className="absolute w-[90%] h-[90%] top-1/2 left-1/2 origin-bottom-left transform -translate-x-1/2 -translate-y-1/2">
          <div
            ref={radarRef}
            className="w-full h-full bg-blue-300 opacity-50 clip-radar rounded-full"
          ></div>
        </div>
        <div className="absolute w-full h-full border border-blue-400 rounded-full"></div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => handleRequestConnect(user.id)}
            className="flex flex-col items-center justify-center bg-white text-blue-600 rounded-full p-4 shadow hover:bg-blue-100 transition-all"
          >
            <div className="text-3xl">📡</div>
            <div className="text-sm mt-2">ID: {user.id.slice(-2)}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 rounded text-sm bg-white text-gray-800 shadow-md">
        <div className={`p-2 rounded ${isConnected ? 'bg-green-200' : 'bg-red-200'}`}>
          {isConnected ? (
            <>
              <span className="text-green-700">Connected</span>
              <div className="text-xs text-gray-500">Your ID: {socketId?.slice(-6)}</div>
            </>
          ) : (
            <span className="text-red-700">Disconnected</span>
          )}
        </div>
      </div>

      {incomingRequest && !connectedTo && (
        <div className="mt-4 bg-white text-black p-4 rounded shadow">
          <p className="mb-2">🔔 Connection request from <strong>{incomingRequest.slice(-2)}</strong></p>
          <button
            onClick={handleAcceptConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Accept
          </button>
        </div>
      )}

      {connectedTo && (
        <div className="mt-4 bg-green-100 text-green-800 p-3 rounded shadow">
          ✅ Connected to user <strong>{connectedTo.slice(-2)}</strong>
        </div>
      )}
    </div>
  );
}
