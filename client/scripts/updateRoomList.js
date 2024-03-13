import { socket } from '../main.js';
import displayChatRoom from './displayGameRoom.js';

export default function updateRoomList(rooms) {
  const roomsContainer = document.querySelector('.rooms_container');
  const userName = localStorage.getItem('user');
  const uuid = localStorage.getItem('userId');
  if (roomsContainer) {
    roomsContainer.innerHTML = '';

    rooms.forEach((room) => {
      const roomName = document.createElement('button');
      roomName.textContent = room.name;
      roomName.id = 'room_btn_' + room.roomId;
      roomName.addEventListener('click', () => {
        socket.emit('join room', room, userName, uuid);
        displayChatRoom(room);
      });
      roomsContainer.appendChild(roomName);
    });
  }
}
