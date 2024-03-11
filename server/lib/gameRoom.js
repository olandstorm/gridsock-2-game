const gameRoom = {
    handleConnection: (socket, io) => {
        //connections to game room
        //Listen to when a player click start button
        socket.on('startGame', () => {
            if (!gameStarted) {
                startGameSession();
                //Send timeinfo to client 
                io.emit('gameDuration', gameDuration);
            }
        });
        
        //Listen to when time is up.
        socket.on('endGame', () => {
            if (gameStarted) {
                endGameSession();
            }
        }); 

        //Listen to when a player disconnects and end game session if noone is left
        socket.on('disconnect', () => {
            if (gameStarted && io.engine.clientsCount === 0) {
                endGameSession();
            }
        });
       
        let gameStarted = false;
        let gameDuration = 1 * 20 * 1000;
        
        function startGameSession() {
            gameStarted = true;
            io.emit('gameStart');
        }
        
        function endGameSession() {
            gameStarted = false;
            io.emit('gameEnd');
        }
    },
     //other functions and logic for game
};


module.exports = gameRoom;