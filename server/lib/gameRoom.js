import calculateResult from "./calculateResult.js";

const gameRoom = {
  handleConnection: (socket, io, roomConnectedUsers, gameGrid) => {
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
		
		// Handle when a player click on a cell
		socket.on('cellClicked', ({ row, col, color, roomId, player }) => {
			//update gameGrid on server
			gameGrid[row][col] = { color, player };
			// Här kan du lägga till logik för att hantera vilken spelare som klickade och uppdatera alla andra klienter
			io.to(roomId).emit('updateCell', {
				row,
				col,
				color /* players color */,
			});
		});

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
					console.log(
						'Disconnected user was in room:',
						disconnectedRoomId
					);
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
			const score = calculateResult();
			io.to(roomId).emit('gameEnd', score );
			
		}
  },

  //other functions and logic for game
};

module.exports = gameRoom;
