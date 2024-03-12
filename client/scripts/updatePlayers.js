import { socket } from '../main.js';

export default function updatePlayers(room) {
  // Updates the player list displayed in the UI based on the received roomConnectedUsers object.
  socket.on('all players', (roomConnectedUsers) => {
    console.log('room in update players:', room);
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
      console.log('user when entering:', user);
      const playerName = document.createElement('li');
      playerName.classList.add('player_name');
      playerName.innerText = user.name;

      playerList.appendChild(playerName);
    });

    playersDiv.appendChild(playerList);
  });
}
