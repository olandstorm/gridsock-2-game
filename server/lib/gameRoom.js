const calculateResult = require('./calculateResult.js');
const saveGameGridToDB = require('./saveGameGridToDB.js');

const gameRoom = {
  handleConnection: (
    socket,
    io,
    roomConnectedUsers,
    allRooms,
    assignedColors,
    gameGrids
  ) => {

    socket.on('startCountdown', (room) => {
      let countdown = 3;
      const countdownToStart = setInterval(() => {
        if (countdown >= 1) {
          io.to(room.roomId).emit('countdown', countdown);
          countdown--;
        } else {
          clearInterval(countdownToStart);
          if (!gameStarted) {
            gameStarted = true;
            io.to(room.roomId).emit('gameStart');
            //Send timeinfo to client
            io.to(room.roomId).emit('gameDuration', gameDuration);
          }
        }
      }, 1000);
    });

    socket.on('cellClicked', ({ row, col, color, roomId, player }) => {
      //update gameGrid on server
      let gameGrid = gameGrids[roomId];
      if (gameGrid.length > row && gameGrid[row].length > col) {
        gameGrid[row][col] = { color, player };

        io.to(roomId).emit('updateCell', {
          row,
          col,
          color,
        });
      } else {
        console.error(`Invalid cell position: row ${row}, col ${col}`);
      }
    });

    //Listen to when time is up.
    socket.on('endGame', async (room) => {
      if (gameStarted) {
        await endGameSession(room.roomId);
      }
    });

    //Listen to when a player disconnects and end game session if noone is left
    socket.on('disconnect', () => {
      Object.keys(roomConnectedUsers).forEach((roomId) => {
        const usersInRoom = roomConnectedUsers[roomId];
        const disconnectedUser = usersInRoom.find(
          (user) => user.userId === socket.id
        );

        if (disconnectedUser) {
          const disconnectedRoomId = roomId;

          //Remove user from room if disconnected
          roomConnectedUsers[roomId] = roomConnectedUsers[roomId].filter(
            (user) => user.userId !== socket.id
          );

          if (roomConnectedUsers[roomId].length === 0) {
            const index = allRooms.findIndex((room) => room.roomId === roomId);
            if (index !== -1) {
              allRooms.splice(index, 1);
            }
          }

          //Push back color
          const disconnectedColor = disconnectedUser.color;
          assignedColors[roomId].push(disconnectedColor);

          io.emit('all players', roomConnectedUsers);

          if (gameStarted && io.engine.clientsCount === 0) {
            endGameSession(disconnectedRoomId);
          }
          io.emit('room list', allRooms);
        }
      });
    });

    let gameStarted = false;
    let gameDuration = 1 * 45 * 1000;

    async function endGameSession(roomId) {
      gameStarted = false;
      const gameGrid = gameGrids[roomId];
      const score = calculateResult(gameGrid, roomConnectedUsers, roomId);

      const gameId = await saveGameGridToDB(gameGrid);

      gameGrids[roomId] = Array(25)
        .fill()
        .map(() => Array(25).fill(null));

      io.to(roomId).emit('gameEnd', { score, gameId });
      io.to(roomId).emit('chat', {
        gameId: gameId,
        user: 'Admin',
        message: 'Coloratulations! Round ended, see results',
        createdAt: new Date().toLocaleString(),
      });
    }
  },
};

module.exports = gameRoom;
