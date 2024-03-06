import { socket } from '../main.js';

export default function sendChat(inputMessage, room) {
  const user = sessionStorage.getItem('user');
  socket.emit('chat', {
    message: inputMessage.value,
    user: user,
    color: 'green',
    room: room,
  });
}
