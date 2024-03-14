import { socket } from '../main.js';
import { currentColor } from './displayMainPage.js';

export default function sendChat(writtenMessage, room) {
  const user = localStorage.getItem('user');
  socket.emit('chat', {
    message: writtenMessage,
    user: user,
    color: currentColor,
    room: room.roomId,
  });
}
