import { socket } from '../main.js';


export default function createGameGrid(gridContainer) {
    
    //const gridContainer = document.getElementById('grid-container');

    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
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
    
        socket.emit('cellClicked', { row, col });
    });
    
    socket.on('updateCell', ({ row, col, color}) => {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        cell.classList.forEach(className => {
            if (className.startsWith('user_')) {
                cell.classList.remove(className);
            }
        });
        
        cell.classList.add(`user_${color}`);
    });
}


