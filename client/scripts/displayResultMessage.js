import { API_URL } from '../main.js';

export default function displayResultMessage(gameId) {
    fetch(API_URL + `results/${gameId}`)
    .then(res => res.json())
    .then(data => {

        const popUpContainer = document.querySelector('.popup_container'); // Subject to change

        const gameGrid = data.gameGrid;
        const popUpResult = document.createElement('div'); // Subject to change
        popUpResult.classList.add('popup_result'); // Subject to change

        gameGrid.forEach((row) => {
            row.forEach((cell) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('result_cell');
                if (cell) {
                    cellDiv.classList.add(`user_${cell.color}`);
                }
                popUpResult.appendChild(cellDiv); // Subject to change
            });
        });

        popUpContainer.insertBefore(popUpResult, popUpContainer.lastChild) // Subject to change
    });
}