import { socket } from '../main.js';

export default function createGameGrid(
  gameContainer,
  roomId,
  beforeGameContainer,
  timerContainer
) {
  beforeGameContainer.innerHTML = '';
  
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('grid_container');

  const cellState = new Array(25).fill().map(() => new Array(25).fill(false));

  for (let x = 0; x < 25; x++) {
    for (let y = 0; y < 25; y++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = x;
      cell.dataset.col = y;
      gridContainer.appendChild(cell);
    }
  }

  gridContainer.addEventListener('click', (event) => {
    const clickedCell = event.target;

    const row = clickedCell.dataset.row;
    const col = clickedCell.dataset.col;
    const color = sessionStorage.getItem('color');
    const player = localStorage.getItem('userId');

    if (row === undefined || col === undefined) {
      return;
    }

    socket.emit('cellClicked', { row, col, color, roomId, player });
  });

  socket.on('updateCell', ({ row, col, color }) => {
    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );

    if (cell) {
      cell.classList.forEach((className) => {
        if (className.startsWith('user_')) {
          cell.classList.remove(className);
        }
      });

      cell.classList.add(`user_${color}`);
    }
  });

  gameContainer.append(timerContainer, gridContainer);
}
