const app = require('express')();
const server = require('http').createServer(app);
const { randomUUID } = require('crypto');
const usersRouter = require('./routes/users');
const { selectColor, assignedColors } = require('./lib/colorAssign.js');
const { generateMessage } = require('./lib/message.js');
const express = require('express');
const gameRoom = require('../lib/gameRoom.js');

app.use(express.json());
app.use('/users', usersRouter);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});



// List of all rooms
const allRooms = [];
const roomConnectedUsers = {};

io.on('connection', (socket) => {
  gameRoom.handleConnection(socket);

  socket.on('chat', (arg) => {
    io.to(arg.room).emit(
      'chat',
      generateMessage(arg.user, arg.message, arg.room, arg.color)
    );
  });

  // Send list of all rooms to every client
  socket.on('get rooms', () => {
    io.emit('room list', allRooms);
  });

  // Add the new room to the allRooms array
  socket.on('create room', (room) => {
    const roomId = randomUUID();
    allRooms.push({ name: room, roomId: roomId });
    socket.emit('room object', { name: room, roomId: roomId });
    io.emit('room list', allRooms);
  });

  // Allow the client to join specific room
  socket.on('join room', (room, username) => {
    const color = selectColor(room.roomId);

    if (!roomConnectedUsers[room.roomId]) {
      roomConnectedUsers[room.roomId] = [];
    }

    // If the room does not include the username, push the username
    if (!roomConnectedUsers[room.roomId].includes(username)) {
      roomConnectedUsers[room.roomId].push(username);
    }

    console.log(roomConnectedUsers);

    socket.join(room.roomId);

    io.emit('all players', roomConnectedUsers);

    socket.emit('room joined', {
      room: room,
      color: color,
    });

    //Send to ONE
    io.to(socket.id).emit(
      'chat',
      generateMessage('Admin', 'Welcome to Color Chaos!')
    );

    //After LOGIN is done we can change user to display name.
    //send to everyone but "me"
    socket.broadcast
      .to(room.roomId)
      .emit('chat', generateMessage('Admin', `New user has joined`, room.name));
  });

  // Hantera när en spelare klickar på en cell
  socket.on('cellClicked', ({ row, col, color, roomId }) => {
    // Här kan du lägga till logik för att hantera vilken spelare som klickade och uppdatera alla andra klienter
    io.to(roomId).emit('updateCell', {
      row,
      col,
      color /* spelarens id eller färg */,
    });
  });

  socket.on('leave room', (room, username, color) => {
    // Push back the color in assignedColors so it can be available again
    assignedColors[room.roomId].push(color);

    roomConnectedUsers[room.roomId] = roomConnectedUsers[room.roomId].filter(
      (user) => user !== username
    );
    socket.leave(room.roomId);

    io.emit('all players', roomConnectedUsers);
    console.log(roomConnectedUsers);
  });
});

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

io.of('/').adapter.on('leave-room', (room, id) => {
  console.log(`socket ${id} has left room ${room}`);
});

server.listen(3000);
