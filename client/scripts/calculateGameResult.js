import { socket } from '../main.js';

export default function calculateGameResult() {
    const cellElements = document.querySelectorAll('.cell');
    const playerScores = {
      pink: 0,
      green: 0,
      blue: 0,
      yellow: 0
    };
  
    cellElements.forEach(cell => {
      // Create an array that will contain the class that defines the users color
      const colorClassList = Array.from(cell.classList).find(className => className.startsWith('user'));

      if (colorClassList) {
        // Retrieve the color by having the underscore as the separator and retrieving the color which comes after
        const color = colorClassList.split('_')[1];
        // Increment the color in playerScores by 1
        playerScores[color]++;
      }
    });
  
  
    let highestScore = 0;
    let winningColor = '';
  
    // Iterate over each property (color) to find highestScore
    for (const color in playerScores) {
      if (playerScores[color] > highestScore) {
        highestScore = playerScores[color];
        winningColor = color;
      }
    }
  
    // Check sessionStorage for the winning color and emit "declare winner"
    const sessionColor = sessionStorage.getItem('color');
    if (sessionColor === winningColor) {
      const winningUsername = localStorage.getItem('user');
      socket.emit('declare winner', winningUsername);  
    }
    socket.on('announce winner', (winner) => {
        const popUpContainer = document.querySelector('.popup_container');
        const declareWinnerDiv = document.createElement('div');
        declareWinnerDiv.classList.add('announce_winner');

        const declareWinnerText = document.createElement('p');
        declareWinnerText.innerText = `The winner is ${winner}, with ${highestScore} cells with the color ${winningColor}`;

        declareWinnerDiv.appendChild(declareWinnerText);

        popUpContainer.insertBefore(declareWinnerDiv, popUpContainer.firstChild);
    })
  
};
  