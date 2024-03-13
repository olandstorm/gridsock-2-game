function calculateResult(gameGrid, roomConnectedUsers, roomId) {
  const playerScores = {};

  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      const cell = gameGrid[row][col];
      if (cell && cell.color && cell.player) {
        const player = roomConnectedUsers[roomId].find(
          (user) => user.uuid === cell.player
        );
        if (player) {
          const playerName = player.name;
          if (!playerScores[playerName]) {
            playerScores[playerName] = 1;
          } else {
            playerScores[playerName]++;
          }
        }
      }
    }
  }
  return playerScores;
}

module.exports = calculateResult;
