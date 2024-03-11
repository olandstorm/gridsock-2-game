let gameStarted = false;
let gameDuration = 1 * 60 * 1000;

function startGameSession() {
    gameStarted = true;
    io.emit('gameStart');
}

function endGameSession() {
    gameStarted = false;
    io.emit('gameEnd');
}

io.on('connection', (socket) => {

    //Listen to when a player click start button
    socket.on('startGame', () => {
        if (!gameStarted) {
            startGameSession();
            //Send timeinfo to client 
            io.emit('gameDuration', gameDuration);
        }
    });

    //Listen to when a player disconnects and end game session if noone is left
    socket.on('disconnect', () => {
        if (gameStarted && io.engine.clientsCount === 0) {
            endGameSession();
        }
    });
});
