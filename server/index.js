const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

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
      const player = room.players.find(p => p.id === socket.id);
      
      // Strict validation:
      // 1. Is it a valid room?
      // 2. Is the sender a player in the room?
      // 3. Is it the sender's turn?
      // 4. Is the sender using their assigned symbol?
      // 5. Is the board position empty?
      if (player && room.turn === player.symbol && symbol === player.symbol && !room.board[index]) {
        room.board[index] = symbol;
        room.turn = symbol === 'X' ? 'O' : 'X';
        io.to(roomCode).emit('move_made', { index, symbol, nextTurn: room.turn });
      } else {
        console.log(`Invalid move attempt by ${socket.id} in room ${roomCode}`);
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

  socket.on('restart_game', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (room) {
      room.board = Array(9).fill(null);
      room.turn = 'X';
      io.to(roomCode).emit('game_restarted');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
