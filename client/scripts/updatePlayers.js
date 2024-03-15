import { socket } from '../main.js';

export default function updatePlayers(room) {
  // Updates the player list displayed in the UI based on the received roomConnectedUsers object.
  socket.on('all players', (roomConnectedUsers) => {
    
    let playersDiv = document.querySelector('.players_list_container');
    let playerList = document.querySelector('.player_list');

    if (!playersDiv) {
      return;
    }

    if (!playerList) {
      playerList = document.createElement('ul');
      playerList.classList.add('player_list');
    } else {
      playerList.innerHTML = '';
    }
    roomConnectedUsers[room].forEach((user) => {
      
      const colorCell = document.createElement('div');
      colorCell.classList.add('player_cell_' + user.color);
      colorCell.classList.add('player_cell');
      const playerName = document.createElement('li');
      playerName.classList.add('player_name');
      playerName.innerText = user.name;

      playerName.prepend(colorCell);
      playerList.append(playerName);
    });

    playersDiv.appendChild(playerList);
  });
}
