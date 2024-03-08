import { socket } from '../main.js';

export default function updatePlayers(room) {
  // Updates the player list displayed in the UI based on the received roomConnectedUsers object.
  socket.on('all players', (roomConnectedUsers) => {
    let chatList = document.getElementById('chatList');
    let playerList = document.querySelector('.player_list');

    if (!classList) {
      return;
    }

    if (!playerList) {
      playerList = document.createElement('ul');
      playerList.classList.add('player_list');
    } else {
      playerList.innerHTML = '';
    }

    roomConnectedUsers[room].forEach((user) => {
      const playerName = document.createElement('li');
      playerName.classList.add('player_name');
      playerName.innerText = user;

      playerList.appendChild(playerName);
    });

    chatList.insertBefore(playerList, chatList.firstChild);
  });
}
