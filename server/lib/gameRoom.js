const gameRoom = {
  handleConnection: (socket, io, roomConnectedUsers) => {
    //connections to game room

    //Listen to countdown
    socket.on('startCountdown', (room) => {
      let countdown = 3;
      const countdownToStart = setInterval(() => {
        if (countdown >= 1) {
          io.to(room.roomId).emit('countdown', countdown);
          countdown--;
        } else {
          clearInterval(countdownToStart);
          /*  io.emit('startGame'); */
          startGame(room.roomId);
        }
      }, 1000);
    });

    //Listen to when a player click start button
    function startGame(roomId) {
      if (!gameStarted) {
        startGameSession(roomId);
        //Send timeinfo to client
        io.to(roomId).emit('gameDuration', gameDuration);
      }
    }

    //Listen to when time is up.
    socket.on('endGame', (room) => {
      if (gameStarted) {
        endGameSession(room.roomId);
      }
    });

    //Listen to when a player disconnects and end game session if noone is left
    socket.on('disconnect', () => {
      Object.keys(roomConnectedUsers).forEach((roomId) => {
        const usersInRoom = roomConnectedUsers[roomId];
        const userIndex = usersInRoom.findIndex(
          (user) => user.userId === socket.id
        );
        if (userIndex !== -1) {
          const disconnectedRoomId = roomId;
          console.log('Disconnected user was in room:', disconnectedRoomId);
          if (gameStarted && io.engine.clientsCount === 0) {
            endGameSession(disconnectedRoomId);
          }
        }
      });
    });

    let gameStarted = false;
    let gameDuration = 1 * 20 * 1000;

    function startGameSession(roomId) {
      gameStarted = true;
      io.to(roomId).emit('gameStart');
    }

    function endGameSession(roomId) {
      gameStarted = false;
      io.to(roomId).emit('gameEnd');
    }
  },

  //other functions and logic for game
};

module.exports = gameRoom;
