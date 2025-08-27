const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    })
  );
}

io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  // ✅ Handle editor room join
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    socket.roomId = roomId;

    const clients = getAllConnectedClients(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // ✅ Handle code editor changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // ✅ Handle whiteboard join (no username required)
  socket.on('WHITEBOARD_JOIN', ({ roomId }) => {
    socket.join(roomId); // Join whiteboard room (can be same room)
    socket.roomId = roomId;
    console.log(`🧑‍🎨 Whiteboard client joined room ${roomId}`);
  });

  // ✅ Handle whiteboard changes
  socket.on('WHITEBOARD_CHANGE', ({ roomId, snapshot }) => {
    socket.to(roomId).emit('WHITEBOARD_CHANGE', { snapshot });
  });

  // ✅ Handle disconnecting for both editor and whiteboard
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

// ✅ Serve frontend build
app.use(express.static('build'));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Listening on port ${PORT}`)
);
