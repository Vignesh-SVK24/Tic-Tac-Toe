const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the root directory
app.use(express.static(__dirname));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ playerName }) => {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    rooms.set(roomCode, {
      players: [{ id: socket.id, name: playerName, symbol: 'X' }],
      board: Array(9).fill(null),
      turn: 'X',
      messages: []
    });
    socket.join(roomCode);
    socket.emit('room_created', { roomCode, symbol: 'X' });
    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  socket.on('join_room', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);
    if (room && room.players.length < 2) {
      room.players.push({ id: socket.id, name: playerName, symbol: 'O' });
      socket.join(roomCode);
      socket.emit('room_joined', { 
        roomCode, 
        symbol: 'O', 
        opponentName: room.players[0].name 
      });
      io.to(roomCode).emit('player_joined', { 
        players: room.players 
      });
      console.log(`${playerName} joined room ${roomCode}`);
    } else {
      socket.emit('error', room ? 'Room is full' : 'Invalid room code');
    }
  });

  socket.on('make_move', ({ roomCode, index, symbol }) => {
    const room = rooms.get(roomCode);
    if (room) {
      if (room.players.length < 2) return;
      const player = room.players.find(p => p.id === socket.id);
      if (player && room.turn === player.symbol && symbol === player.symbol && !room.board[index]) {
        room.board[index] = symbol;
        room.turn = symbol === 'X' ? 'O' : 'X';
        io.to(roomCode).emit('move_made', { index, symbol, nextTurn: room.turn });
      }
    }
  });

  socket.on('send_message', ({ roomCode, message, playerName }) => {
    const room = rooms.get(roomCode);
    if (room) {
      const msgData = { 
        text: message, 
        sender: playerName, 
        senderId: socket.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      room.messages.push(msgData);
      io.to(roomCode).emit('new_message', msgData);
    }
  });

  socket.on('request_restart', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        player.wantsRestart = true;
      }
      if (room.players.length === 2 && room.players.every(p => p.wantsRestart)) {
        room.players.forEach(p => {
          p.wantsRestart = false;
          p.symbol = p.symbol === 'X' ? 'O' : 'X';
        });
        room.board = Array(9).fill(null);
        room.turn = 'X';
        io.to(roomCode).emit('game_restarted', { players: room.players });
      }
    }
  });

  socket.on('disconnect', () => {
    for (const [roomCode, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          rooms.delete(roomCode);
        } else {
          io.to(roomCode).emit('opponent_disconnected');
        }
        break;
      }
    }
  });
});

// For all other routes, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

