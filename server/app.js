const app = require('express')();
const server = require('http').createServer(app);
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

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  //console.log("connection", socket)

  //Send to ONE
  socket.emit('chat', generateMessage('Admin', 'Welcome to Color Chaos!'));

  //send to everyone but "me"
  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', `New user has joined`)
  );

  socket.on('chat', (arg) => {
    console.log('incoming chat', arg);
    console.log('to room', arg.room);
    console.log(`User ${socket.id} connected to rooms:`, socket.rooms);
    io.to(arg.room).emit(
      'chat',
      generateMessage(arg.user, arg.message, arg.room)
    );
  });

  // Send list of all rooms to every client
  socket.on('get rooms', () => {
    io.emit('room list', allRooms);
  });

  // Add the new room to the allRooms array
  socket.on('create room', (room) => {
    allRooms.push(room);
  });

  // Allow the client to join specific room
  socket.on('join room', (room) => {
    const color = selectColor(room);
    socket.join(room);
    console.log('joined room:', room);
    console.log(
      `User ${socket.id} connected to rooms:`,
      socket.rooms,
      ' with color:',
      color
    );
  });
});

app.get('/test', (req, res) => {
  res.send('<h1>socket</h1>');
});

server.listen(3000);
