// src/App.jsx
import React, { useState, useEffect } from 'react';
import RoleSelect from './component/RoleSelect';
import FindUser from './component/FindUser';
import FileTransfer from './component/FileTransfer';
import { io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);
  const [role, setRole] = useState(null);
  const [connectedTo, setConnectedTo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/bonjour-hosts')
      .then(r => r.json())
      .then(hosts => {
        const url = hosts[0] || 'http://localhost:5000';
        const s = io(url, { autoConnect: true });
        s.on('connect_error', err => {
          setError('LAN server not found. Make sure the backend is running.');
        });
        s.on('connect', () => setError(null));
        if (!cancelled) setSocket(s);
      })
      .catch(() => {
        setError('Could not discover LAN hosts.');
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (socket && role) socket.emit('set-role', role);
  }, [socket, role]);

  if (error) return <div className="text-red-600 p-8">❌ {error}</div>;
  if (!socket) return <div>🔌 Connecting to LAN server...</div>;
  if (!role) return <RoleSelect setRole={setRole} />;
  if (!connectedTo) return <FindUser socket={socket} role={role} onConnected={setConnectedTo} />;
  return <FileTransfer socket={socket} role={role} connectedTo={connectedTo} />;
}

export default App;
