import { socket } from '../main.js';
import { currentColor } from './displayMainPage.js';

export default function sendChat(inputMessage, room) {
  console.log(currentColor);
  const user = sessionStorage.getItem('user');
  socket.emit('chat', {
    message: inputMessage.value,
    user: user,
    color: currentColor,
    room: room,
  });
}
