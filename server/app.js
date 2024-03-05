const app = require("express")();
const server = require("http").createServer(app);

const { generateMessage } = require('./lib/message.js');

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


// List of all rooms
const allRooms = [];

io.on("connection", (socket) => {
    //console.log("connection", socket)

    //Send to ONE
    socket.emit("chat", generateMessage('Admin', 'Welcome to Color Chaos!'));

    //send to everyone but "me"
    socket.broadcast.emit('newMessage', generateMessage('Admin', `New user has joined`));

    
    socket.on("chat", (arg) => {
        console.log("incoming chat", arg);
        io.emit("chat", generateMessage(arg.user, arg.message));
    })

    // Send list of all rooms to every client
    socket.on("get rooms", () => {
        io.emit("room list", allRooms)
    })

    // Add the new room to the allRooms array
    socket.on("create room", (room) => {
        allRooms.push(room);
    })

    // Allow the client to join specific room
    socket.on("join room", (room) => {
        socket.join(room);
    });
})

app.get("/test", (req, res) => {

    res.send("<h1>socket</h1>")
})

server.listen(3000);