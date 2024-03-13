export default function displayResultMessage(gameGrid) {
  console.log('gameGrid in displayResultMessage', gameGrid);

  const innerGrid = gameGrid.gameGrid;
  const popUpResult = document.createElement('div'); // Subject to change
  popUpResult.classList.add('popup_result'); // Subject to change

  innerGrid.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('result_cell');
      if (cell) {
        cellDiv.classList.add(`user_${cell.color}`);
      }
      popUpResult.appendChild(cellDiv); // Subject to change
    });
  });

  return popUpResult;
}
