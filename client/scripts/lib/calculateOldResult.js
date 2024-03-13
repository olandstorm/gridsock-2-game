export default function calculateOldResult(gameGrid) {
  const colorScores = {};

  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      const cell = gameGrid[row][col];
      if (cell && cell.color) {
        const color = cell.color;
        if (!colorScores[color]) {
          colorScores[color] = 1;
        } else {
          colorScores[color]++;
        }
      }
    }
  }
  return colorScores;
}
