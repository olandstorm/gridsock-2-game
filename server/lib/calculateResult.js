function calculateResult(gameGrid) {
	const playerScores = {
		/* number of colored celss for each player */
	};

	for (let row = 0; row < 25; row++) {
		for (let col = 0; col < 25; col++) {
			const cell = gameGrid[row][col];
			if (cell && cell.color && cell.player) {
				if (!playerScores[cell.player]) {
					playerScores[cell.player] = 1;
				} else {
					playerScores[cell.player]++;
				}
			}
		}
	}
	return playerScores;
}

module.exports = calculateResult;
