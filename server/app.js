const app = require('express')();
const server = require('http').createServer(app);
const { randomUUID } = require('crypto');
const { selectColor } = require('./lib/colorAssign.js');
const { generateMessage } = require('./lib/message.js');

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
  console.log(`User connected: ${socket.id}`);
  //console.log("connection", socket)

  socket.on('chat', (arg) => {
    console.log('incoming chat', arg);
    console.log('to room', arg.room);
    console.log(`User ${socket.id} connected to rooms:`, socket.rooms);
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
  });

  // Allow the client to join specific room
  socket.on('join room', (room, username) => {
    const color = selectColor(room);

    if (!roomConnectedUsers[room]) {
      roomConnectedUsers[room] = [];
    }

    // If the room does not include the username, push the username
    if (!roomConnectedUsers[room].includes(username)) {
      roomConnectedUsers[room].push(username);
    }

    socket.join(room);
    io.emit('all players', roomConnectedUsers);
    console.log(
      `User ${socket.id} connected to rooms:`,
      socket.rooms,
      ' with color:',
      color
    );
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
      .to(room)
      .emit('chat', generateMessage('Admin', `New user has joined`, room));

    // Hantera när en spelare klickar på en cell
    socket.on('cellClicked', ({ row, col }) => {
      // Här kan du lägga till logik för att hantera vilken spelare som klickade och uppdatera alla andra klienter
      io.emit('updateCell', { row, col, color /* spelarens id eller färg */ });
    });

    socket.on('leave room', (room, username) => {
      roomConnectedUsers[room] = roomConnectedUsers[room].filter(
        (user) => user !== username
      );
      socket.leave(room);
      io.emit('all players', roomConnectedUsers);
    });
  });
});

server.listen(3000);
