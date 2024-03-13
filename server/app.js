const app = require('express')();
const server = require('http').createServer(app);
const { randomUUID } = require('crypto');
const usersRouter = require('./routes/users');
const { selectColor, assignedColors } = require('./lib/colorAssign.js');
const { generateMessage } = require('./lib/message.js');
const express = require('express');
const cors = require('cors');
const gameRoom = require('./lib/gameRoom.js');

app.use(cors());
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
  gameRoom.handleConnection(
    socket,
    io,
    roomConnectedUsers,
    allRooms,
    assignedColors
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
    const existingUser = roomConnectedUsers[room.roomId].find(
      (user) => user.userId === socket.id
    );

    if (!existingUser) {
      roomConnectedUsers[room.roomId].push({
        name: username,
        userId: socket.id,
        color: color,
      });
    }

    console.log('connected users:', roomConnectedUsers);

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

    //Disable button if theres 4 players in room
    const playersInRoom = roomConnectedUsers[room.roomId].length;
    if (playersInRoom >= 4) {
      socket.broadcast.emit('room full', room.roomId);
      io.emit('enable start');
    }
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
    if (assignedColors[room.roomId] !== undefined) {
      assignedColors[room.roomId].push(color);

      roomConnectedUsers[room.roomId] = roomConnectedUsers[room.roomId].filter(
        (user) => user.name !== username
      );

      socket.leave(room.roomId);

      io.emit('all players', roomConnectedUsers);
      console.log('room coonected users', roomConnectedUsers);

      //Removes room if empty
      const playersInRoom = roomConnectedUsers[room.roomId].length;
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

io.of('/').adapter.on('join-room', (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
});

io.of('/').adapter.on('leave-room', (room, id) => {
  console.log(`socket ${id} has left room ${room}`);
});

server.listen(3000);
