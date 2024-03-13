import './style.scss';
import { io } from 'socket.io-client';
import printStart from './scripts/displayStartPage.js';
import displayMainPage from './scripts/displayMainPage';

export const API_URL =
  'https://lionfish-app-dp3is.ondigitalocean.app/' || 'http://localhost:3000/';
export const socket = io(API_URL);

// User state check
if (localStorage.getItem('user')) {
  displayMainPage();
} else {
  printStart();
}

/* let sendMessage = document.querySelector('#sendMessage');
let sendBtn = document.querySelector('#sendBtn');
let chatList = document.querySelector('#chatList');

sendBtn.addEventListener('click', () => {
  let user = sessionStorage.getItem('user');
  console.log('send chat', sendMessage.value);
  socket.emit('chat', {
    message: sendMessage.value,
    user: user,
  });
});

socket.on('chat', (arg) => {
  console.log('socket', arg);

  updateChat(arg);
});

function updateChat(chat) {
  let li = document.createElement('li');
  li.innerText = chat.user + ': ' + chat.message;
  chatList.appendChild(li);
} */
