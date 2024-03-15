const app = require('express')();
const server = require('http').createServer(app);
const { randomUUID } = require('crypto');
const usersRouter = require('./routes/users');
const resultsRouter = require('./routes/results.js');
const { selectColor, assignedColors } = require('./lib/colorAssign.js');
const { generateMessage } = require('./lib/message.js');
const express = require('express');
const cors = require('cors');
const gameRoom = require('./lib/gameRoom.js');

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/results', resultsRouter);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const allRooms = [];
const roomConnectedUsers = {};
const gameGrids = [];

io.on('connection', (socket) => {
  gameRoom.handleConnection(
    socket,
    io,
    roomConnectedUsers,
    allRooms,
    assignedColors,
    gameGrids
  );

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
    // Create gameGrid in specific room
    if (!gameGrids[roomId]) {
      gameGrids[roomId] = Array(25)
        .fill()
        .map(() => Array(25).fill(null));
    }
    socket.emit('room object', { name: room, roomId: roomId });
    io.emit('room list', allRooms);
  });

  // Allow the client to join specific room
  socket.on('join room', (room, username, uuid) => {
    const color = selectColor(room.roomId);

    if (!roomConnectedUsers[room.roomId]) {
      roomConnectedUsers[room.roomId] = [];
    }

  
    const existingUser = roomConnectedUsers[room.roomId].find(
      (user) => user.userId === socket.id
    );

    if (!existingUser) {
      roomConnectedUsers[room.roomId].push({
        name: username,
        uuid: uuid,
        userId: socket.id,
        color: color,
      });
    }

    socket.join(room.roomId);

    io.emit('all players', roomConnectedUsers);

    socket.emit('room joined', {
      room: room,
      color: color,
    });

    
    io.to(socket.id).emit(
      'chat',
      generateMessage('Admin', 'Welcome to Color Chaos!')
    );

    
    socket.broadcast
      .to(room.roomId)
      .emit('chat', generateMessage('Admin', `New user has joined`, room.name));

    //Disable button if there is 4 players in room
    const playersInRoom = roomConnectedUsers[room.roomId].length;
    if (playersInRoom >= 2) {
      io.to(room.roomId).emit('enable start');
      io.to(room.roomId).emit('start over');
    }
    if (playersInRoom === 4) {
      socket.broadcast.emit('room full', room.roomId);
    }
  });

  socket.on('start over', (room) => {
    const playersInRoom = roomConnectedUsers[room.roomId].length;

    if (playersInRoom >= 2) {
      io.to(room.roomId).emit('start over');
    }
  });

  socket.on('leave room', (room, username, color) => {
    // Push back the color in assignedColors so it can be available again
    if (assignedColors[room.roomId] !== undefined) {
      assignedColors[room.roomId].push(color);

      roomConnectedUsers[room.roomId] = roomConnectedUsers[room.roomId].filter(
        (user) => user.name !== username
      );

      socket.leave(room.roomId);

      io.emit('all players', roomConnectedUsers);
      console.log('room coonected users', roomConnectedUsers);

      const playersInRoom = roomConnectedUsers[room.roomId].length;
      if (playersInRoom < 2) {
        io.to(room.roomId).emit('player left', room);
      }
      if (playersInRoom === 0) {
        //Removes room if empty
        allRooms.splice(
          allRooms.findIndex((r) => r.roomId === room.roomId),
          1
        );
      }
    }
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT);
