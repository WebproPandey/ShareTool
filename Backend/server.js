import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import bonjour from 'bonjour';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET','POST'], maxHttpBufferSize: 1e8 }
});

let users = {};
function clearSocket(socket) {
  delete users[socket.id];
  io.emit('users', Object.values(users));
}

io.on('connection', socket => {
  console.log('🔌 Connected:', socket.id);

  socket.on('set-role', role => {
    users[socket.id] = { id: socket.id, role };
    io.emit('users', Object.values(users));
  });

  socket.on('request-connection', ({ to }) => io.to(to).emit('connection-request', { from: socket.id }));
  socket.on('accept-connection', ({ to }) => io.to(to).emit('connection-accepted', { from: socket.id }));
  socket.on('send-file', ({ to, fileName, fileData }) => io.to(to).emit('receive-file', { fileName, fileData }));

  socket.on('disconnect', () => clearSocket(socket));
});

// ✅ Improved /bonjour-hosts endpoint for reliable LAN discovery
app.get('/bonjour-hosts', (req, res) => {
  const browser = bonjour().find({ type: 'http' });
  const hosts = [];
  const timer = setTimeout(() => {
    browser.stop();
    res.json(hosts.length ? hosts : [
      `${req.protocol}://${req.hostname}:${PORT}` // fallback to self
    ]);
  }, 2000); // 2 seconds to discover

  browser.on('up', service => {
    const host = `http://${service.referer.address}:${service.port}`;
    if (!hosts.includes(host)) hosts.push(host);
  });
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server on port ${PORT}`);
  bonjour().publish({ name: 'OfflineShare', type: 'http', port: PORT });
});
