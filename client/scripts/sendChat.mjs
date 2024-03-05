import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

export default function sendChat(inputMessage) {
  const user = sessionStorage.getItem('user');
  socket.emit('chat', {
    message: inputMessage.value,
    user: user,
    color: 'green',
  });
}
