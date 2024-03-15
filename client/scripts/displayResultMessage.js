export default function displayResultMessage(gameGrid) {

  const innerGrid = gameGrid.gameGrid;
  const popUpResult = document.createElement('div');
  popUpResult.classList.add('popup_result'); 

  innerGrid.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('result_cell');
      if (cell) {
        cellDiv.classList.add(`user_${cell.color}`);
      }
      popUpResult.appendChild(cellDiv); 
    });
  });

  return popUpResult;
}
