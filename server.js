const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {};

// Utility to get all connected clients in a room
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

  /* ==============================
     Editor / presence
  ============================== */
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

    // System join message
    io.to(roomId).emit('SYSTEM_MESSAGE', {
      message: `${username} joined the chat`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  /* ==============================
     Whiteboard
  ============================== */
  socket.on('WHITEBOARD_JOIN', ({ roomId }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`🧑‍🎨 Whiteboard client joined room ${roomId}`);
  });

  socket.on('WHITEBOARD_CHANGE', ({ roomId, snapshot }) => {
    if (!snapshot || typeof snapshot !== 'object') return;
    if (Object.keys(snapshot).length === 0) return;

    socket.to(roomId).emit('WHITEBOARD_CHANGE', { snapshot });
  });

  /* ==============================
     Chat
  ============================== */
  socket.on('CHAT_MESSAGE', ({ roomId, message }) => {
    const username = userSocketMap[socket.id] || 'Anonymous';
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const payload = { username, message, time };
    console.log(`[CHAT] ${roomId} <- ${username}: ${message}`);

    io.to(roomId).emit('CHAT_MESSAGE', payload);
  });

  // Typing indicator
  socket.on('TYPING', ({ roomId, username, isTyping }) => {
    socket.to(roomId).emit('TYPING', { username, isTyping });
  });

  /* ==============================
     Disconnect
  ============================== */
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      io.to(roomId).emit('SYSTEM_MESSAGE', {
        message: `${userSocketMap[socket.id]} left the chat`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });

      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

/* ==============================
   Serve frontend
============================== */
app.use(express.static('build'));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));
