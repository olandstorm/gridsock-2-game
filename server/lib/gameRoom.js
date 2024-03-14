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
          if (!gameStarted) {
            gameStarted = true;
            io.emit('game on', room.roomId);
            io.to(room.roomId).emit('gameStart');
            //Send timeinfo to client
            io.to(room.roomId).emit('gameDuration', gameDuration);
          }
        }
      }, 1000);
    });

    // Handle when a player click on a cell
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

    function calculateNull(gameGrid) {
      const allCellsNull = gameGrid.every((row) =>
        row.every((cell) => cell === null)
      );

      if (allCellsNull) {
        return true;
      } else {
        return false;
      }
    }

    //Listen to when time is up.
    socket.on('endGame', async (room) => {
      if (calculateNull(gameGrids[room.roomId])) {
        console.log('NO CELL CLICKED!');
        gameStarted = false;
        io.to(room.roomId).emit('game without click');
      } else {
        if (gameStarted) {
          await endGameSession(room.roomId);
        }
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
          //console.log('Disconnected user was in room:', disconnectedRoomId);

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
    let gameDuration = 1 * 5 * 1000;

    async function endGameSession(roomId) {
      gameStarted = false;
      io.emit('game off', roomId);
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

  //other functions and logic for game
};

module.exports = gameRoom;
