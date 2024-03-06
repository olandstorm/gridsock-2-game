import { socket } from '../main.js';
import displayChatRoom from './displayChatRoom';

export default function updateRoomList(rooms) {
  const roomsContainer = document.querySelector('.rooms_container');
  if (roomsContainer) {
    roomsContainer.innerHTML = '';

    rooms.forEach((room) => {
      const roomName = document.createElement('button');
      roomName.textContent = room;
      roomName.addEventListener('click', () => {
        socket.emit('join room', room);
        displayChatRoom(room);
      });
      roomsContainer.appendChild(roomName);
    });
  }
}
