const app = require('express')();
const server = require('http').createServer(app);

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
    socket.join(room);
    console.log('joined room:', room);
    console.log(`User ${socket.id} connected to rooms:`, socket.rooms);
    
    //Send to ONE
    io.to(socket.id).emit('chat', generateMessage('Admin', 'Welcome to Color Chaos!'));
    
     //After LOGIN is done we can change user to display name.
    //send to everyone but "me"
    socket.broadcast.to(room).emit('chat', generateMessage('Admin', `New user has joined`, room));
  });
});


server.listen(3000);
