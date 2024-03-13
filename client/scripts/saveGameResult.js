//function to calculate end result when game is over.

export default function saveGameResult() {
	const playerColors = ['pink', 'blue', 'green', 'yellow'];
	const result = [];

	for (let row = 0; row < 25; row++) {
		for (let col = 0; col < 25; col++) {
			const cell = { row, col, color: null, player: null };
			const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

			// Check if cell is colored
			for (let i = 0; i < playerColors.length; i++) {
				if (cellElement.classList.contains(`user_${playerColors[i]}`)) {
					cell.color = playerColors[i];
					cell.player = i + 1;
					break;
				}
			}

			result.push(cell);
		}
	}
	//saveResultToDatabase(result);
}